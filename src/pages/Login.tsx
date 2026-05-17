import { 
  signInWithPopup, 
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Car, Shield, Leaf, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login failed', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized. Please add this URL to your Firebase Console under Authentication > Settings > Authorized Domains.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background font-sans">
      {/* Left Decoration */}
      <div className="hidden lg:flex flex-1 bg-primary/5 relative items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" />
        </div>
        
        <div className="relative z-10 p-12 max-w-lg space-y-6">
          <h1 className="text-6xl font-display font-bold leading-tight">
            The Future of <span className="text-primary">Mobility</span> is Here.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Join thousands of smart drivers reducing their carbon footprint through AI-powered optimization.
          </p>
          <div className="flex gap-4">
            <FeatureItem icon={Leaf} text="Eco Routing" />
            <FeatureItem icon={Shield} text="Safe Driving" />
          </div>
        </div>
      </div>

      {/* Right Login Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-8 w-8 bg-primary rounded-lg" />
              <span className="text-2xl font-display font-bold tracking-tighter uppercase">AetherX</span>
            </div>
            <h2 className="text-3xl font-display font-bold">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your intelligent mobility dashboard.</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 text-red-500 text-xs leading-relaxed"
            >
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <p className="text-center text-xs text-gray-500 px-8">
            By continuing, you agree to AetherX's Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
      <Icon size={16} className="text-primary" />
      <span>{text}</span>
    </div>
  );
}
