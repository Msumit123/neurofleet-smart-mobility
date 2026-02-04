import { useEffect, useState, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle, Telemetry } from '@/types';

interface AnimatedMarkerProps {
  vehicle: Vehicle;
  position: [number, number];
  telemetry: Telemetry;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Create vehicle icon based on type and status
const createVehicleIcon = (type: Vehicle['type'], status: Vehicle['status'], isSelected: boolean) => {
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

  const size = isSelected ? 48 : 40;
  const borderWidth = isSelected ? 4 : 3;
  const boxShadow = isSelected 
    ? '0 0 20px rgba(6, 182, 212, 0.6), 0 4px 12px rgba(0,0,0,0.3)' 
    : '0 4px 12px rgba(0,0,0,0.3)';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[status]};
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: ${boxShadow};
        font-size: ${isSelected ? 24 : 20}px;
        transition: all 0.3s ease;
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
      ">
        ${icons[type]}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function AnimatedMarker({
  vehicle,
  position,
  telemetry,
  isSelected = false,
  onSelect,
}: AnimatedMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(position);
  
  // Smooth position updates using CSS transitions
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      
      // Update position smoothly
      marker.setLatLng(position);
      setCurrentPosition(position);
      
      // Add rotation based on heading
      const icon = marker.getElement();
      if (icon) {
        const innerDiv = icon.querySelector('div');
        if (innerDiv && telemetry.engineStatus === 'ON') {
          // Subtle pulse animation for moving vehicles
          innerDiv.style.animation = 'pulse 2s infinite';
        } else if (innerDiv) {
          innerDiv.style.animation = 'none';
        }
      }
    }
  }, [position, telemetry.engineStatus]);
  
  // Update icon when selection changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(createVehicleIcon(vehicle.type, vehicle.status, isSelected));
    }
  }, [vehicle.type, vehicle.status, isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={currentPosition}
      icon={createVehicleIcon(vehicle.type, vehicle.status, isSelected)}
      eventHandlers={{
        click: onSelect,
      }}
    >
      <Popup>
        <div className="min-w-[200px] p-2">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-foreground">{vehicle.name}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
              vehicle.status === 'IN_USE' ? 'bg-cyan-100 text-cyan-800' :
              vehicle.status === 'NEEDS_SERVICE' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {vehicle.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{vehicle.licensePlate}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block">Speed</span>
              <span className="font-bold text-lg">{Math.round(telemetry.speed)}</span>
              <span className="text-muted-foreground"> km/h</span>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block">Fuel</span>
              <span className="font-bold text-lg">{Math.round(telemetry.fuelLevel)}</span>
              <span className="text-muted-foreground">%</span>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block">Heading</span>
              <span className="font-bold">{Math.round(telemetry.heading)}°</span>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <span className="text-muted-foreground block">Engine</span>
              <span className={`font-bold ${telemetry.engineStatus === 'ON' ? 'text-green-600' : 'text-gray-500'}`}>
                {telemetry.engineStatus}
              </span>
            </div>
          </div>
          
          {vehicle.assignedDriverName && (
            <div className="mt-3 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Driver: </span>
              <span className="text-sm font-medium">{vehicle.assignedDriverName}</span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
