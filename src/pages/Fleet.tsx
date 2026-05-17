import Navbar from '../components/layout/Navbar';
import { 
  Building2, Users, TrendingUp, AlertCircle, 
  MapPin, CheckCircle2, MoreVertical, Search, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Fleet() {
  const fleetData = [
    { name: 'Vehicle A', efficiency: 94, co2: 2.1 },
    { name: 'Vehicle B', efficiency: 88, co2: 2.8 },
    { name: 'Vehicle C', efficiency: 92, co2: 2.4 },
    { name: 'Vehicle D', efficiency: 76, co2: 4.1 },
    { name: 'Vehicle E', efficiency: 91, co2: 2.5 },
  ];

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 ml-28 mr-6 my-6 overflow-y-auto no-scrollbar space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Fleet Management</h1>
            <p className="text-gray-400">Enterprise sustainable mobility oversight.</p>
          </div>
          <div className="flex gap-4 font-sans">
            <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold border-white/5 hover:bg-white/10">
              <Search size={18} />
              Search Fleet
            </button>
            <button className="bg-primary text-black px-6 py-3 rounded-2xl font-bold text-sm">
              Generate Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
          <FleetMetric icon={Building2} label="Active Vehicles" value="12" />
          <FleetMetric icon={Users} label="Total Drivers" value="48" />
          <FleetMetric icon={TrendingUp} label="Avg Efficiency" value="89.4%" />
          <FleetMetric icon={AlertCircle} label="System Alerts" value="2" color="text-red-400" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 glass p-8 rounded-[40px]">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Fleet Performance (Eco Score)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fleetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                />
                <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
                  {fleetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.efficiency > 85 ? '#00FF41' : '#FF4B4B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass p-8 rounded-[40px] flex flex-col">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Live Status</h3>
            <div className="space-y-6 flex-1">
              <StatusItem label="Vehicle A" status="Roaming" time="4m ago" color="bg-secondary" />
              <StatusItem label="Vehicle B" status="Charging" time="1h ago" color="bg-primary" />
              <StatusItem label="Vehicle D" status="Alert: Idle" time="12m ago" color="bg-red-500" />
              <StatusItem label="Vehicle E" status="Completed" time="1s ago" color="bg-gray-500" />
            </div>
            <button className="w-full mt-8 py-4 border border-white/5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5">
              View All Logs
            </button>
          </div>
        </div>

        <div className="glass p-8 rounded-[40px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-display font-bold">Leaderboard: Top Drivers</h3>
            <div className="text-xs text-secondary font-bold uppercase tracking-widest bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
              This Month
            </div>
          </div>
          
          <div className="space-y-4">
            <DriverRow rank={1} name="Sarah Jenkins" score={994} vehicles={4} co2="124kg" />
            <DriverRow rank={2} name="Michael Chen" score={982} vehicles={3} co2="118kg" />
            <DriverRow rank={3} name="David Miller" score={968} vehicles={2} co2="102kg" />
          </div>
        </div>
      </main>
    </div>
  );
}

function FleetMetric({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-8 rounded-[32px] space-y-4">
      <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${color || 'text-primary'}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-3xl font-display font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</div>
      </div>
    </div>
  );
}

function StatusItem({ label, status, time, color }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`h-2 w-2 rounded-full ${color} shadow-[0_0_8px] shadow-current`} />
        <div>
          <div className="text-sm font-bold group-hover:text-primary transition-colors">{label}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{status}</div>
        </div>
      </div>
      <div className="text-[10px] text-gray-600 font-mono tracking-tighter">{time}</div>
    </div>
  );
}

function DriverRow({ rank, name, score, vehicles, co2 }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer font-sans">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-display font-black text-white/20 italic group-hover:text-primary transition-colors">0{rank}</span>
        <div>
          <div className="text-lg font-bold">{name}</div>
          <div className="text-xs text-gray-500 mt-1">{vehicles} Vehicles Managed</div>
        </div>
      </div>
      <div className="flex gap-12 items-center">
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-secondary">{score}</div>
          <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Eco Points</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-primary">{co2}</div>
          <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">CO₂ Saved</div>
        </div>
        <ChevronRight size={20} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
