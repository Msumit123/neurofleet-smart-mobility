import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, Telemetry } from '@/types';
import { cn } from '@/lib/utils';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom vehicle icons
const createVehicleIcon = (type: Vehicle['type'], status: Vehicle['status']) => {
  const colors = {
    AVAILABLE: '#22c55e',
    IN_USE: '#06b6d4',
    NEEDS_SERVICE: '#f59e0b',
    OFFLINE: '#6b7280',
  };

  const icons = {
    CAR: '🚗',
    BIKE: '🏍️',
    AUTO: '🛺',
    VAN: '🚐',
  };

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: ${colors[status]};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 20px;
      ">
        ${icons[type]}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

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

interface FleetMapProps {
  vehicles: Vehicle[];
  telemetry: Record<string, Telemetry>;
  selectedVehicleId?: string;
  onVehicleSelect?: (vehicleId: string) => void;
  showRoute?: boolean;
  route?: [number, number][];
  pickup?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  className?: string;
  height?: string;
}

// Component to fit bounds when vehicles change
function FitBounds({ vehicles, telemetry }: { vehicles: Vehicle[]; telemetry: Record<string, Telemetry> }) {
  const map = useMap();

  useEffect(() => {
    const positions = vehicles
      .map(v => telemetry[v.id])
      .filter(t => t)
      .map(t => [t.latitude, t.longitude] as [number, number]);

    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, telemetry, map]);

  return null;
}

export default function FleetMap({
  vehicles,
  telemetry,
  selectedVehicleId,
  onVehicleSelect,
  showRoute = false,
  route,
  pickup,
  destination,
  className,
  height = '500px',
}: FleetMapProps) {
  const center: [number, number] = [12.9716, 77.5946]; // Bangalore

  return (
    <div className={cn('map-container', className)} style={{ height }}>
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

        <FitBounds vehicles={vehicles} telemetry={telemetry} />

        {/* Vehicle markers */}
        {vehicles.map((vehicle) => {
          const vehicleTelemetry = telemetry[vehicle.id];
          if (!vehicleTelemetry) return null;

          return (
            <Marker
              key={vehicle.id}
              position={[vehicleTelemetry.latitude, vehicleTelemetry.longitude]}
              icon={createVehicleIcon(vehicle.type, vehicle.status)}
              eventHandlers={{
                click: () => onVehicleSelect?.(vehicle.id),
              }}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <p className="font-semibold text-foreground">{vehicle.name}</p>
                  <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <span className="ml-1 font-medium">{Math.round(vehicleTelemetry.speed)} km/h</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="ml-1 font-medium">{Math.round(vehicleTelemetry.fuelLevel)}%</span>
                    </div>
                  </div>
                  {vehicle.assignedDriverName && (
                    <p className="mt-2 text-xs">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="ml-1 font-medium">{vehicle.assignedDriverName}</span>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
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
