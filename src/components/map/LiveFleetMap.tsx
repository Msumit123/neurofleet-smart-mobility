import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from '@/types';
import { cn } from '@/lib/utils';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import AnimatedMarker from './AnimatedMarker';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createPickupIcon = () => {
  return L.divIcon({
    className: 'custom-pickup-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #22c55e;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 16px;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    className: 'custom-destination-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #ef4444;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 16px;
      ">
        🏁
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface LiveFleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect?: (vehicleId: string) => void;
  showRoute?: boolean;
  route?: [number, number][];
  pickup?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  className?: string;
  height?: string;
  updateInterval?: number;
  centerOn?: [number, number]; // New prop for programmatic centering
}

// Component to handle map bounds and follow selected vehicle
function MapController({ 
  vehicles, 
  selectedVehicleId,
  getInterpolatedPosition,
  centerOn,
}: { 
  vehicles: Vehicle[]; 
  selectedVehicleId?: string;
  getInterpolatedPosition: (id: string) => [number, number] | null;
  centerOn?: [number, number];
}) {
  const map = useMap();

  // Handle external center commands
  useEffect(() => {
    if (centerOn) {
      map.flyTo(centerOn, 14, { animate: true, duration: 1.5 });
    }
  }, [centerOn, map]);

  // Fit bounds on initial load
  useEffect(() => {
    if (centerOn) return; // Don't fit bounds if we are focusing on a specific point

    const positions: [number, number][] = [];
    
    vehicles.forEach(v => {
      const pos = getInterpolatedPosition(v.id);
      if (pos) positions.push(pos);
    });

    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [vehicles.length]); // Only on vehicle count change

  // Follow selected vehicle
  useEffect(() => {
    if (selectedVehicleId) {
      const pos = getInterpolatedPosition(selectedVehicleId);
      if (pos) {
        map.panTo(pos, { animate: true, duration: 0.5 });
      }
    }
  }, [selectedVehicleId, getInterpolatedPosition, map]);

  return null;
}

export default function LiveFleetMap({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  showRoute = false,
  route,
  pickup,
  destination,
  className,
  height = '500px',
  updateInterval = 1000,
  centerOn,
}: LiveFleetMapProps) {
  const center: [number, number] = [12.9716, 77.5946]; // Bangalore

  // Use live telemetry hook
  const { telemetry, getInterpolatedPosition } = useLiveTelemetry({
    vehicles,
    updateInterval,
    enabled: true,
  });

  return (
    <div className={cn('map-container relative', className)} style={{ height }}>
      {/* Live indicator */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-lg border border-border">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
        </span>
        <span className="text-xs font-medium text-foreground">LIVE</span>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController 
          vehicles={vehicles} 
          selectedVehicleId={selectedVehicleId}
          getInterpolatedPosition={getInterpolatedPosition}
          centerOn={centerOn}
        />

        {/* Animated vehicle markers */}
        {vehicles.map((vehicle) => {
          const position = getInterpolatedPosition(vehicle.id);
          const vehicleTelemetry = telemetry[vehicle.id];
          
          if (!position || !vehicleTelemetry) return null;

          return (
            <AnimatedMarker
              key={vehicle.id}
              vehicle={vehicle}
              position={position}
              telemetry={vehicleTelemetry}
              isSelected={selectedVehicleId === vehicle.id}
              onSelect={() => onVehicleSelect?.(vehicle.id)}
            />
          );
        })}

        {/* Route line */}
        {showRoute && route && route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#06b6d4',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* Pickup marker */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={createPickupIcon()}>
            <Popup>
              <div className="p-1">
                <p className="font-semibold">Pickup Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={createDestinationIcon()}>
            <Popup>
              <div className="p-1">
                <p className="font-semibold">Destination</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
