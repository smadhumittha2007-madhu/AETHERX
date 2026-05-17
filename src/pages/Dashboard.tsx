import { useState } from 'react';
import AetherMap from '../components/maps/AetherMap';
import AetherVoice from '../components/voice/AetherVoice';
import Navbar from '../components/layout/Navbar';
import { motion } from 'motion/react';
import { Leaf, Zap, Shield, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [destination, setDestination] = useState<string | undefined>();

  const handleVoiceAction = (res: any) => {
    if (res.action === 'NAVIGATE' && res.params?.location) {
      setDestination(res.params.location);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden font-sans relative">
      {/* Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />
      
      <main className="flex-1 ml-28 mr-6 my-6 flex gap-6 relative z-10">
        {/* Left Side: Map & Navigation */}
        <div className="flex-[2] relative">
          <AetherMap destination={destination} />
          <AetherVoice onAction={handleVoiceAction} />
        </div>

        {/* Right Side: Quick Stats & Dashboard Widgets */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4 no-scrollbar min-w-[320px]">
          <div className="glass p-6 md:p-8 rounded-[32px] relative overflow-hidden group flex-shrink-0">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Leaf size={120} />
            </div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4">Daily Impact</h2>
            <div className="flex items-end gap-2 flex-wrap">
              <span className="text-4xl md:text-5xl font-display font-bold">12.4</span>
              <span className="text-slate-400 text-sm mb-1.5 md:mb-2 lowercase">kg CO₂ saved</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-primary text-xs font-medium">
              <TrendingDown size={14} />
              <span>15% better than 30d avg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 flex-shrink-0">
            <StatCard icon={Zap} label="Eco Points" value="840" color="primary" />
            <StatCard icon={Shield} label="Safety Score" value="98" color="secondary" />
          </div>

          <div className="glass p-6 md:p-8 rounded-[32px] flex-shrink-0">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-6">Active Vehicle</h2>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="h-12 w-12 md:h-14 md:w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Zap size={28} />
              </div>
              <div className="overflow-hidden">
                <div className="text-lg md:text-xl font-display font-bold truncate">Model 3 Perf</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 truncate text-ellipsis">14.5 kWh/100km</div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                <span className="text-slate-500">Charge Level</span>
                <span className="text-primary tracking-normal">82%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 md:p-8 rounded-[32px] flex-shrink-0 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={14} className="text-secondary" />
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">AI Insight</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic">
              "Your regenerative braking is peak-optimal. This behavior saves approximately 15% more energy than standard settings."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorMap: any = {
    primary: 'text-primary border-primary/20 bg-primary/5',
    secondary: 'text-secondary border-secondary/20 bg-secondary/5',
  };

  return (
    <div className={`p-6 rounded-[32px] border flex flex-col gap-3 ${colorMap[color]}`}>
      <Icon size={20} />
      <div>
        <div className="text-2xl font-display font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold">{label}</div>
      </div>
    </div>
  );
}
