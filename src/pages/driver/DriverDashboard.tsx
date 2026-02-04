import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Navigation,
  Fuel,
  Gauge,
  Clock,
  MapPin,
  User,
  Play,
  Square,
  Phone,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FleetMap from '@/components/map/FleetMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getAssignedVehicle, getActiveTrip } from '@/lib/api';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import { Vehicle, Trip } from '@/types';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [assignedVehicle, setAssignedVehicle] = useState<Vehicle | null>(null);
  const [currentTrip, setCurrentTrip] = useState<any | null>(null);
  const [tripStarted, setTripStarted] = useState(false);

  // Fetch assigned vehicle and trip
  useEffect(() => {
    const fetchData = async () => {
        if (!user?.id) return;
        try {
            const vehicle = await getAssignedVehicle(user.id);
            setAssignedVehicle(vehicle);
            
            const trip = await getActiveTrip(user.id);
            setCurrentTrip(trip);
            if (trip && trip.status === 'IN_PROGRESS') {
                setTripStarted(true);
            }
        } catch (e) {
            console.error(e);
        }
    };
    fetchData();
    // Poll
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const { telemetry } = useLiveTelemetry({ 
    vehicles: assignedVehicle ? [assignedVehicle] : [],
    enabled: true 
  });
  
  const vehicleTelemetry = assignedVehicle ? telemetry[assignedVehicle.id] : null;

  if (!assignedVehicle) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <Car className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No Vehicle Assigned</h2>
            <p className="text-muted-foreground">
              Please wait for a vehicle to be assigned to you
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Trip Status */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-muted-foreground">
              {currentTrip ? 'Active Trip in Progress' : 'Waiting for ride requests'}
            </p>
          </div>
          {currentTrip && (
            <div className="flex gap-2">
              {tripStarted ? (
                <Button variant="destructive" onClick={() => setTripStarted(false)}>
                  <Square className="mr-2 h-4 w-4" />
                  End Trip
                </Button>
              ) : (
                <Button variant="success" onClick={() => setTripStarted(true)}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Trip
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Live Map - Main Focus */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <FleetMap
              vehicles={[assignedVehicle]}
              telemetry={vehicleTelemetry ? { [assignedVehicle.id]: vehicleTelemetry } : {}}
              showRoute={!!currentTrip}
              route={currentTrip?.route}
              pickup={currentTrip ? { lat: currentTrip.pickup.latitude, lng: currentTrip.pickup.longitude } : undefined}
              destination={currentTrip ? { lat: currentTrip.destination.latitude, lng: currentTrip.destination.longitude } : undefined}
              height="400px"
            />
          </CardContent>
        </Card>

        {/* Vehicle Telemetry & Trip Info */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Vehicle Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{assignedVehicle.name}</p>
                  <p className="text-sm text-muted-foreground">{assignedVehicle.licensePlate}</p>
                </div>
                <Badge variant="in-use">In Use</Badge>
              </div>

              {vehicleTelemetry && (
              <>
              {/* Speed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" /> Speed
                  </span>
                  <span className="font-mono text-lg font-bold text-primary">
                    {Math.round(vehicleTelemetry.speed)} km/h
                  </span>
                </div>
                <Progress value={vehicleTelemetry.speed} max={80} className="h-2" />
              </div>

              {/* Fuel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Fuel className="h-4 w-4" /> Fuel Level
                  </span>
                  <span className={`font-mono text-lg font-bold ${vehicleTelemetry.fuelLevel < 20 ? 'text-destructive' : 'text-success'}`}>
                    {Math.round(vehicleTelemetry.fuelLevel)}%
                  </span>
                </div>
                <Progress 
                  value={vehicleTelemetry.fuelLevel} 
                  className={`h-2 ${vehicleTelemetry.fuelLevel < 20 ? '[&>div]:bg-destructive' : '[&>div]:bg-success'}`} 
                />
              </div>

              {/* Engine Status */}
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Engine Status</span>
                <Badge variant={vehicleTelemetry.engineStatus === 'ON' ? 'success' : 'secondary'}>
                  {vehicleTelemetry.engineStatus}
                </Badge>
              </div>
              </>
              )}
            </CardContent>
          </Card>

          {/* Current Trip Details */}
          {currentTrip && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-info" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pickup */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                    <p className="font-medium">{currentTrip.pickup.address}</p>
                  </div>
                </div>

                {/* Route line */}
                <div className="ml-4 h-8 w-px bg-border" />

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium">{currentTrip.destination.address}</p>
                  </div>
                </div>

                {/* ETA */}
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    Estimated Arrival
                  </span>
                  <span className="font-bold text-primary">{currentTrip.eta} mins</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Info */}
          {currentTrip && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-xl font-bold text-primary-foreground">
                    {currentTrip.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{currentTrip.customerName}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Customer
                </Button>

                {/* Traffic Info */}
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">Traffic Conditions</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Light traffic ahead</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
