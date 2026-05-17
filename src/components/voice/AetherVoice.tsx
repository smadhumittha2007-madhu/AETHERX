import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceResponse {
  text: string;
  action: "NAVIGATE" | "SEARCH_PLACES" | "CHECK_STATS" | "GENERAL_CHAT";
  params?: any;
  ecoTip?: string;
}

export default function AetherVoice({ onAction }: { onAction: (res: VoiceResponse) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    synthRef.current = window.speechSynthesis;
  }, []);

  const handleVoiceCommand = async (command: string) => {
    try {
      const res = await fetch('/api/gemini/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data: VoiceResponse = await res.json();
      
      setLastResponse(data.text);
      onAction(data);
      speak(data.text);
    } catch (error) {
      console.error('Failed to process command', error);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <AnimatePresence>
        {lastResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass px-6 py-3 rounded-2xl max-w-md text-sm text-center shadow-2xl"
          >
            {lastResponse}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${isListening ? 'bg-secondary opacity-50' : 'bg-secondary opacity-0'}`} />
        <button
          onClick={toggleListening}
          className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] ${
            isListening ? 'bg-secondary scale-110' : 'glass hover:bg-white/10'
          }`}
        >
          {isListening ? (
            <div className="flex gap-1 items-center">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  className="w-1 bg-black rounded-full"
                />
              ))}
            </div>
          ) : (
            <Mic className="text-white" size={24} />
          )}
        </button>
      </div>

      {isSpeaking && (
        <div className="flex gap-2">
          <Volume2 size={16} className="text-secondary animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Aether Speaking</span>
        </div>
      )}
    </div>
  );
}
