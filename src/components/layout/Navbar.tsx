import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Car, Users, Settings, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: BarChart3, path: '/analytics', label: 'Insights' },
    { icon: Car, path: '/profile', label: 'Vehicles' },
    { icon: Users, path: '/fleet', label: 'Fleet' },
  ];

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-2xl transition-all duration-300 relative group ${
              isActive ? 'bg-primary text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={24} />
            <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] uppercase font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest whitespace-nowrap">
              {item.label}
            </div>
          </Link>
        );
      })}
      
      <button 
        onClick={() => auth.signOut()}
        className="p-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all mt-8"
      >
        <LogOut size={24} />
      </button>
    </nav>
  );
}
