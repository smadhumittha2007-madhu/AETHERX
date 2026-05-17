import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Fleet from './pages/Fleet';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
  const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

  return (
    <BrowserRouter>
      {!hasValidKey && (
        <div className="fixed top-4 right-4 z-[100] glass px-4 py-2 rounded-full border-amber-500/20 flex items-center gap-2 pointer-events-none">
          <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Demo Mode Active</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/fleet" element={user ? <Fleet /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
