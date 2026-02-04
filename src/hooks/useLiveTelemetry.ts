import { useState, useEffect, useCallback, useRef } from 'react';
import { Telemetry, Vehicle } from '@/types';

interface UseLiveTelemetryOptions {
  vehicles: Vehicle[];
  updateInterval?: number; // ms
  enabled?: boolean;
}

interface TelemetryWithAnimation extends Telemetry {
  prevLatitude?: number;
  prevLongitude?: number;
  animationProgress?: number;
}

// Simulate realistic vehicle movement
function simulateMovement(telemetry: Telemetry, vehicle: Vehicle): Telemetry {
  const isMoving = vehicle.status === 'IN_USE';
  const wasMoving = telemetry.engineStatus === 'ON';
  
  // Bangalore boundaries for realistic movement
  const BOUNDS = {
    minLat: 12.85,
    maxLat: 13.10,
    minLng: 77.45,
    maxLng: 77.75,
  };
  
  // Calculate new position for moving vehicles
  let newLat = telemetry.latitude;
  let newLng = telemetry.longitude;
  let newSpeed = telemetry.speed;
  let newHeading = telemetry.heading;
  
  if (isMoving) {
    // Gradually accelerate or maintain speed
    const targetSpeed = 30 + Math.random() * 40; // 30-70 km/h
    newSpeed = telemetry.speed + (targetSpeed - telemetry.speed) * 0.1;
    newSpeed = Math.max(0, Math.min(80, newSpeed));
    
    // Slight heading adjustments (simulating roads)
    const headingChange = (Math.random() - 0.5) * 15;
    newHeading = (telemetry.heading + headingChange + 360) % 360;
    
    // Convert speed to coordinate movement
    // ~111km per degree latitude, ~85km per degree longitude at this latitude
    const speedFactor = (newSpeed / 3600) * 2; // Exaggerated for visibility
    const latChange = Math.cos(newHeading * Math.PI / 180) * speedFactor / 111;
    const lngChange = Math.sin(newHeading * Math.PI / 180) * speedFactor / 85;
    
    newLat = Math.max(BOUNDS.minLat, Math.min(BOUNDS.maxLat, telemetry.latitude + latChange));
    newLng = Math.max(BOUNDS.minLng, Math.min(BOUNDS.maxLng, telemetry.longitude + lngChange));
    
    // Bounce off boundaries
    if (newLat <= BOUNDS.minLat || newLat >= BOUNDS.maxLat) {
      newHeading = 180 - newHeading;
    }
    if (newLng <= BOUNDS.minLng || newLng >= BOUNDS.maxLng) {
      newHeading = 360 - newHeading;
    }
  } else {
    // Gradually decelerate if stopping
    newSpeed = Math.max(0, telemetry.speed * 0.8);
  }
  
  // Fuel consumption
  const fuelConsumption = isMoving ? 0.02 : 0.001;
  const newFuelLevel = Math.max(5, telemetry.fuelLevel - fuelConsumption);
  
  // Battery level for electric vehicles
  const newBatteryLevel = telemetry.batteryLevel 
    ? Math.max(5, telemetry.batteryLevel - (isMoving ? 0.03 : 0.005))
    : undefined;
  
  return {
    ...telemetry,
    latitude: newLat,
    longitude: newLng,
    speed: newSpeed,
    heading: newHeading,
    fuelLevel: newFuelLevel,
    batteryLevel: newBatteryLevel,
    engineStatus: isMoving ? 'ON' : 'OFF',
    timestamp: new Date(),
  };
}

export function useLiveTelemetry({ 
  vehicles, 
  updateInterval = 1000,
  enabled = true 
}: UseLiveTelemetryOptions) {
  const [telemetry, setTelemetry] = useState<Record<string, TelemetryWithAnimation>>({});
  
  const vehicleMapRef = useRef<Map<string, Vehicle>>(new Map());
  
  // Keep vehicle map updated and initialize telemetry for new vehicles
  useEffect(() => {
    vehicleMapRef.current = new Map(vehicles.map(v => [v.id, v]));

    setTelemetry(prev => {
      const next = { ...prev };
      let hasChanges = false;
      
      vehicles.forEach(v => {
        if (!next[v.id] && v.latitude !== undefined && v.longitude !== undefined) {
          hasChanges = true;
          next[v.id] = {
            vehicleId: v.id,
            latitude: v.latitude,
            longitude: v.longitude,
            speed: 0,
            heading: 0,
            fuelLevel: 100,
            engineStatus: v.status === 'IN_USE' ? 'ON' : 'OFF',
            timestamp: new Date(),
            prevLatitude: v.latitude,
            prevLongitude: v.longitude,
            animationProgress: 1,
          };
        }
      });
      
      return hasChanges ? next : prev;
    });
  }, [vehicles]);
  
  // Telemetry update loop
  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const updated: Record<string, TelemetryWithAnimation> = {};
        
        for (const vehicleId in prev) {
          const vehicle = vehicleMapRef.current.get(vehicleId);
          if (!vehicle) {
            updated[vehicleId] = prev[vehicleId];
            continue;
          }
          
          const currentTelemetry = prev[vehicleId];
          const newTelemetry = simulateMovement(currentTelemetry, vehicle);
          
          updated[vehicleId] = {
            ...newTelemetry,
            prevLatitude: currentTelemetry.latitude,
            prevLongitude: currentTelemetry.longitude,
            animationProgress: 0,
          };
        }
        
        return updated;
      });
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [enabled, updateInterval]);
  
  // Animation progress update (for smooth marker movement)
  useEffect(() => {
    if (!enabled) return;
    
    let animationFrame: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      setTelemetry(prev => {
        let hasChanges = false;
        const updated: Record<string, TelemetryWithAnimation> = {};
        
        for (const vehicleId in prev) {
          const t = prev[vehicleId];
          if (t.animationProgress !== undefined && t.animationProgress < 1) {
            hasChanges = true;
            updated[vehicleId] = {
              ...t,
              animationProgress: Math.min(1, t.animationProgress + deltaTime / updateInterval),
            };
          } else {
            updated[vehicleId] = t;
          }
        }
        
        return hasChanges ? updated : prev;
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [enabled, updateInterval]);
  
  // Get interpolated position for smooth animation
  const getInterpolatedPosition = useCallback((vehicleId: string): [number, number] | null => {
    const t = telemetry[vehicleId];
    if (!t) return null;
    
    if (t.prevLatitude === undefined || t.prevLongitude === undefined || t.animationProgress === undefined) {
      return [t.latitude, t.longitude];
    }
    
    // Ease-out interpolation for smoother movement
    const progress = 1 - Math.pow(1 - t.animationProgress, 3);
    
    const lat = t.prevLatitude + (t.latitude - t.prevLatitude) * progress;
    const lng = t.prevLongitude + (t.longitude - t.prevLongitude) * progress;
    
    return [lat, lng];
  }, [telemetry]);
  
  return {
    telemetry,
    getInterpolatedPosition,
  };
}
