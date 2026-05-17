import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import Navbar from '../components/layout/Navbar';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { TrendingUp, Leaf, Droplets, Target } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState([
    { name: 'Mon', emissions: 4.5, savings: 2.1 },
    { name: 'Tue', emissions: 3.8, savings: 2.8 },
    { name: 'Wed', emissions: 5.2, savings: 1.5 },
    { name: 'Thu', emissions: 4.1, savings: 2.4 },
    { name: 'Fri', emissions: 3.5, savings: 3.1 },
    { name: 'Sat', emissions: 2.1, savings: 4.5 },
    { name: 'Sun', emissions: 1.8, savings: 5.2 },
  ]);

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 ml-28 mr-6 my-6 overflow-y-auto no-scrollbar space-y-8">
        <header>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Sustainability Analytics</h1>
          <p className="text-gray-400">Real-time breakdown of your mobility footprint.</p>
        </header>

        <div className="grid grid-cols-4 gap-6">
          <MetricBadge icon={Leaf} label="Total CO₂ Saved" value="142.5kg" color="text-secondary" />
          <MetricBadge icon={Droplets} label="Fuel Reduced" value="58.2 L" color="text-primary" />
          <MetricBadge icon={TrendingUp} label="Efficiency Increase" value="+12.4%" color="text-green-400" />
          <MetricBadge icon={Target} label="Eco Goal" value="84%" color="text-purple-400" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <ChartCard title="Emission Trends (Weekly)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#7C4DFF" fillOpacity={1} fill="url(#colorEm)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Eco Savings Comparison">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                />
                <Bar dataKey="savings" fill="#00FF41" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="glass p-8 rounded-[40px]">
          <h3 className="text-xl font-display font-bold mb-6">Recent Trip Breakdown</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5">
                <th className="pb-4 font-bold">Route</th>
                <th className="pb-4 font-bold">Distance</th>
                <th className="pb-4 font-bold">Eco Score</th>
                <th className="pb-4 font-bold">CO₂ Reduced</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TripRow route="Home → Office" distance="12.4 km" score="94" co2="0.8kg" />
              <TripRow route="Office → Supermarket" distance="3.2 km" score="82" co2="0.2kg" />
              <TripRow route="Weekend Getaway" distance="142.0 km" score="88" co2="4.5kg" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function MetricBadge({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl flex items-center gap-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</div>
        <div className="text-2xl font-display font-bold">{value}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="glass p-8 rounded-[40px]">
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-8">{title}</h3>
      {children}
    </div>
  );
}

function TripRow({ route, distance, score, co2 }: any) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer font-sans">
      <td className="py-6 font-medium">{route}</td>
      <td className="py-6 text-gray-400">{distance}</td>
      <td className="py-6">
        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">{score}%</span>
      </td>
      <td className="py-6 text-primary font-bold">{co2}</td>
    </tr>
  );
}
