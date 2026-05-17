import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";

interface RouteInfo {
  ecoScore: number;
  emissions: number;
  distance: number;
  duration: number;
}

export default function AetherMap({ destination }: { destination?: string }) {
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, () => {
      // Fallback if geo fails
    });
  }, []);

  const hasKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

  return (
    <div className="h-full w-full rounded-[40px] overflow-hidden glass relative">
      {hasKey ? (
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={center}
            defaultZoom={13}
            mapId="AETHER_MAP_ID"
            {...{ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] }}
            className="h-full w-full"
            colorScheme="DARK"
            disableDefaultUI
          >
            {destination && <DirectionsHandler destination={destination} onRouteFound={setRouteInfo} />}
          </Map>
        </APIProvider>
      ) : (
        <div className="h-full w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <MockVectorMap destination={destination} />
          
          <div className="z-10 text-center space-y-4 px-12">
            <div className="text-primary animate-pulse font-display font-medium tracking-[0.4em] text-[10px] uppercase">
              Digital Twin Interface Active
            </div>
            <div className="text-white/40 text-4xl font-display font-bold leading-tight">
              {destination ? `NAVIGATING TO\n${destination.toUpperCase()}` : 'AETHER SYSTEM READY'}
            </div>
          </div>

          {!routeInfo && destination && (
            <button 
              onClick={() => setRouteInfo({ ecoScore: 94, emissions: 0.8, distance: 4200, duration: 600 })}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 glass px-8 py-3 text-[10px] uppercase font-bold text-primary hover:bg-white/5 active:scale-95 transition-all tracking-[0.2em]"
            >
              Simulate Route Data
            </button>
          )}
        </div>
      )}

      {routeInfo && (
        <div className="absolute top-8 left-8 right-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <RouteStatsCard 
            label="Eco Score" 
            value={`${routeInfo.ecoScore}%`} 
            color="text-secondary" 
            sub="Green Route"
          />
          <RouteStatsCard 
            label="Emissions" 
            value={`${routeInfo.emissions}kg CO2`} 
            color="text-accent" 
            sub="Estimated"
          />
          <RouteStatsCard 
            label="Time" 
            value={`${Math.round(routeInfo.duration / 60)} min`} 
            color="text-primary" 
            sub="ETA"
          />
        </div>
      )}
    </div>
  );
}

function DirectionsHandler({ destination, onRouteFound }: { destination: string, onRouteFound: (info: RouteInfo) => void }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !destination) return;

    polylinesRef.current.forEach(p => p.setMap(null));
    
    const routeService = (routesLib as any).Route;
    if (!routeService) return;

    routeService.computeRoutes({
      origin: "current location", // Using center as fallback or actual GPS
      destination: destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
      // Note: Real routing would need actual lat/lng for origin
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const route = routes[0];
        const newPolylines = route.createPolylines();
        newPolylines.forEach(p => {
          p.setMap(map);
          p.setOptions({ strokeColor: '#00E5FF', strokeWeight: 6, strokeOpacity: 0.8 });
        });
        polylinesRef.current = newPolylines;
        if (route.viewport) map.fitBounds(route.viewport);

        onRouteFound({
          ecoScore: 92, // Mock logic for now
          emissions: 1.2,
          distance: route.distanceMeters || 0,
          duration: parseInt(route.durationMillis || "0") / 1000
        });
      }
    });
  }, [routesLib, map, destination]);

  return null;
}

function RouteStatsCard({ label, value, color, sub }: any) {
  return (
    <div className="glass flex-shrink-0 px-6 py-4 rounded-2xl min-w-[160px]">
      <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{label}</div>
      <div className={`text-2xl font-display font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

function MockVectorMap({ destination }: { destination?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-primary/20" />
      </pattern>
      <rect width="100" height="100" fill="url(#grid)" />

      <rect x="10" y="10" width="15" height="20" rx="1" fill="currentColor" className="text-white/5" />
      <rect x="70" y="15" width="20" height="10" rx="1" fill="currentColor" className="text-white/5" />
      <rect x="40" y="50" width="12" height="18" rx="1" fill="currentColor" className="text-white/5" />
      <rect x="60" y="70" width="25" height="15" rx="1" fill="currentColor" className="text-white/5" />

      <path d="M 0 45 L 100 45" stroke="currentColor" strokeWidth="0.2" className="text-white/10" />
      <path d="M 45 0 L 45 100" stroke="currentColor" strokeWidth="0.2" className="text-white/10" />

      {destination && (
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M 20 80 Q 50 70 80 20" 
          fill="none" 
          stroke="var(--color-primary)" 
          strokeWidth="0.6" 
          strokeDasharray="2 1" 
        />
      )}

      <circle cx="20" cy="80" r="1.2" fill="var(--color-secondary)" />
      {destination && (
        <motion.circle 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          cx="80" cy="20" r="1.5" 
          fill="var(--color-accent)" 
        />
      )}
    </svg>
  );
}
