import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/layout/Navbar';
import { 
  Car, Plus, Trash2, Battery, Fuel, Bike, 
  Truck, Settings, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ 
    type: 'ev', 
    make: '', 
    model: '', 
    efficiency: '',
    fuelType: 'Electric' 
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'users', auth.currentUser.uid, 'vehicles'));
    return onSnapshot(q, (snap) => {
      setVehicles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'vehicles'), newVehicle);
    setShowAdd(false);
    setNewVehicle({ type: 'ev', make: '', model: '', efficiency: '', fuelType: 'Electric' });
  };

  const setActiveVehicle = async (id: string) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { activeVehicleId: id });
  };

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 ml-28 mr-6 my-6 overflow-y-auto no-scrollbar space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">My Fleet</h1>
            <p className="text-gray-400">Manage and switch between your sustainable vehicles.</p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-primary text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <VehicleCard 
              key={v.id} 
              vehicle={v} 
              onSelect={() => setActiveVehicle(v.id)}
            />
          ))}
          
          {vehicles.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center glass rounded-[40px] border-dashed">
              <Car size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No vehicles registered yet</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass p-10 rounded-[40px] w-full max-w-md relative"
              >
                <h3 className="text-2xl font-display font-bold mb-8">Register Vehicle</h3>
                <form onSubmit={handleAddVehicle} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">Vehicle Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      <TypeOption 
                        icon={Battery} 
                        label="EV" 
                        active={newVehicle.type === 'ev'} 
                        onClick={() => setNewVehicle({ ...newVehicle, type: 'ev', fuelType: 'Electric' })} 
                      />
                      <TypeOption 
                        icon={Fuel} 
                        label="Petrol" 
                        active={newVehicle.type === 'petrol'} 
                        onClick={() => setNewVehicle({ ...newVehicle, type: 'petrol', fuelType: 'Petrol' })} 
                      />
                      <TypeOption 
                        icon={Bike} 
                        label="Bike" 
                        active={newVehicle.type === 'bike'} 
                        onClick={() => setNewVehicle({ ...newVehicle, type: 'bike', fuelType: 'N/A' })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input label="Make" value={newVehicle.make} onChange={v => setNewVehicle({...newVehicle, make: v})} />
                    <Input label="Model" value={newVehicle.model} onChange={v => setNewVehicle({...newVehicle, model: v})} />
                    <Input label="Efficiency (L/100km or Wh/km)" value={newVehicle.efficiency} onChange={v => setNewVehicle({...newVehicle, efficiency: v})} />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAdd(false)}
                      className="flex-1 px-6 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-6 py-4 rounded-2xl bg-primary text-black font-bold hover:bg-cyan-400 transition-colors"
                    >
                      Save Vehicle
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function VehicleCard({ vehicle, onSelect }: any) {
  const Icon = vehicle.type === 'ev' ? Battery : (vehicle.type === 'bike' ? Bike : Fuel);
  
  return (
    <div 
      onClick={onSelect}
      className="glass p-8 rounded-[40px] group cursor-pointer hover:border-primary/40 transition-all hover:translate-y-[-4px]"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
          <Icon size={24} />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-secondary font-bold px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
          {vehicle.fuelType}
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-2xl font-display font-bold">{vehicle.make}</h4>
        <p className="text-gray-400 text-sm">{vehicle.model}</p>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="text-gray-500 uppercase tracking-widest font-bold">Efficiency</div>
        <div className="text-white font-mono">{vehicle.efficiency}</div>
      </div>
    </div>
  );
}

function TypeOption({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
        active ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/20'
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block font-bold">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
}
