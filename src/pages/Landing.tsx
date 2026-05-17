import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, Mic, Map as MapIcon, BarChart3, 
  RotateCcw, Globe, Zap, Leaf 
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary rounded" />
          <span className="text-xl font-display font-bold tracking-tighter uppercase">AetherX</span>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">
          <Link to="#" className="hover:text-white transition-colors">Technology</Link>
          <Link to="#" className="hover:text-white transition-colors">Sustainability</Link>
          <Link to="#" className="hover:text-white transition-colors">Fleet</Link>
        </div>
        <Link 
          to="/login" 
          className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all duration-500"
        >
          Enter Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Items */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 10 }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          />
          <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8"
          >
            <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">AI Sustainable Mobility Engine v3.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-display font-bold leading-[0.85] tracking-tighter mb-8"
          >
            DRIVE <span className="text-secondary italic">SMARTER</span>.<br />
            DRIVE <span className="text-primary tracking-tight">GREENER</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Meet Aether, the intelligent AI assistant that optimizes your routes, tracks emissions, and rewards your sustainable driving habits—all hands-free.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/login" 
              className="group bg-primary text-black px-10 py-5 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-all"
            >
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-white font-bold flex items-center gap-3 hover:text-primary transition-colors">
              Watch Vision Film
              <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center">
                <RotateCcw size={16} />
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-12 py-32 bg-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={Mic}
            title="Aether AI Voice"
            description="Complete hands-free interaction for navigation, search, and vehicle diagnostics via advanced NLP."
          />
          <FeatureCard 
            icon={MapIcon}
            title="Eco-Optimal Routing"
            description="Intelligent route planning that prioritizes low emissions and fuel efficiency without compromising ETA."
          />
          <FeatureCard 
            icon={BarChart3}
            title="Emission Insights"
            description="Visualized real-time tracking of CO2 reduction and fuel savings with AI-generated feedback."
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-12 py-40 text-center">
        <h2 className="text-5xl font-display font-bold mb-8">Join the movement towards a cleaner future.</h2>
        <Link to="/login" className="bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-primary transition-colors inline-block">
          Launch AetherX
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-12 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-primary rounded-sm" />
          <span className="text-sm font-display font-bold uppercase tracking-tighter">AetherX</span>
        </div>
        <div className="text-gray-500 text-xs text-center flex gap-8">
          <span>&copy; 2026 AetherX Mobility Labs</span>
          <Link to="#" className="hover:text-white">Privacy</Link>
          <Link to="#" className="hover:text-white">Terms</Link>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Globe size={18} className="text-gray-500 hover:text-white cursor-pointer" />
          <Link to="#" className="text-gray-500 hover:text-white">GitHub</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="glass p-10 rounded-[40px] hover:border-primary/40 transition-colors group">
      <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
