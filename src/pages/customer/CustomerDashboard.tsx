import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Bike,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Navigation,
  Users,
  Zap,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FleetMap from '@/components/map/FleetMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockVehicles, mockTelemetry, mockTrips } from '@/data/mockData';
import { Vehicle } from '@/types';
import { cn } from '@/lib/utils';

const vehicleTypes = [
  { type: 'BIKE' as const, label: 'Bike', icon: Bike, baseFare: 25, perKm: 8 },
  { type: 'AUTO' as const, label: 'Auto', icon: Car, baseFare: 30, perKm: 12 },
  { type: 'CAR' as const, label: 'Car', icon: Car, baseFare: 50, perKm: 15 },
  { type: 'VAN' as const, label: 'XL', icon: Users, baseFare: 80, perKm: 20 },
];

export default function CustomerDashboard() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedType, setSelectedType] = useState<Vehicle['type']>('CAR');
  const [showBooking, setShowBooking] = useState(false);

  const availableVehicles = mockVehicles.filter(
    v => v.status === 'AVAILABLE' && v.type === selectedType
  );

  const currentTrip = mockTrips[0];

  // Calculate estimated fare
  const estimatedDistance = 8.5; // km
  const selectedVehicleType = vehicleTypes.find(v => v.type === selectedType);
  const estimatedFare = selectedVehicleType
    ? selectedVehicleType.baseFare + (selectedVehicleType.perKm * estimatedDistance)
    : 0;

  const handleBook = () => {
    setShowBooking(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Book a Ride</h1>
          <p className="text-muted-foreground">
            Get to your destination quickly and safely
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Where to?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pickup */}
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                  <Input
                    id="pickup"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div className="space-y-2">
                <Label>Select Vehicle Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {vehicleTypes.map((vehicle) => (
                    <button
                      key={vehicle.type}
                      onClick={() => setSelectedType(vehicle.type)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all',
                        selectedType === vehicle.type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <vehicle.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{vehicle.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ₹{vehicle.perKm}/km
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fare Estimate */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Distance</span>
                  <span className="font-medium">{estimatedDistance} km</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Time</span>
                  <span className="font-medium">25 mins</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Estimated Fare</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{Math.round(estimatedFare)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Vehicles */}
              <div className="text-sm text-muted-foreground">
                <span className="text-success font-medium">{availableVehicles.length}</span> {selectedType.toLowerCase()}s available nearby
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleBook}
                disabled={!pickup || !destination}
              >
                <Zap className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <FleetMap
                vehicles={availableVehicles}
                telemetry={mockTelemetry}
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Active Trip / Recent Trips */}
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-info" />
                  Your Ride is Confirmed!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Driver Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-2xl font-bold text-primary-foreground">
                      D
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Derek Driver</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span>4.8</span>
                        <span className="mx-1">•</span>
                        <span>500+ trips</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">Innova Crysta</p>
                    <p className="text-sm text-muted-foreground">KA-01-CD-5678</p>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Arriving in</p>
                      <p className="text-2xl font-bold text-primary">5 mins</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Call Driver
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share Trip
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => setShowBooking(false)}>
                    Cancel Ride
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Available Vehicles List */}
        <Card>
          <CardHeader>
            <CardTitle>Available {selectedType.toLowerCase()}s Near You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {availableVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-border bg-card/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                    </div>
                    <Badge variant="available">Available</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Users className="mr-1 inline h-4 w-4" />
                      {vehicle.capacity} seats
                    </span>
                    <span className="text-muted-foreground">
                      {vehicle.fuelType}
                    </span>
                  </div>
                </motion.div>
              ))}
              {availableVehicles.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  No {selectedType.toLowerCase()}s available at the moment
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
