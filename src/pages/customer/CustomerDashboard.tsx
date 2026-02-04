import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  MapPin,
  Clock,
  CreditCard,
  Search,
  Star,
  Navigation
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LiveFleetMap from '@/components/map/LiveFleetMap';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAvailableVehicles, createTrip } from '@/lib/api';
import { Vehicle } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getAvailableVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
        toast({ title: "Error", description: "Could not load available vehicles", variant: "destructive" });
      }
    };
    fetchVehicles();
  }, []);

  // Use real fetched vehicles
  const availableVehicles = vehicles.slice(0, 3);

  const handleBook = async (vehicleId: string) => {
    if (!pickup || !destination) {
        toast({ title: "Error", description: "Please enter pickup and destination", variant: "destructive" });
        return;
    }
    setIsSearching(true);
    
    try {
        // Mock geocoding for demo (Real app would use Google Maps API)
        const pickupLoc = { latitude: 12.9716, longitude: 77.5946, address: pickup };
        const destLoc = { latitude: 12.9800, longitude: 77.6000, address: destination };
        
        const bookingData = {
            vehicleId,
            customerId: user?.id,
            customerName: user?.name,
            pickup: pickupLoc,
            destination: destLoc
        };
        
        const trip = await createTrip(bookingData);
        
        setIsSearching(false);
        setActiveBooking({
            id: trip.id,
            vehicleId,
            pickup: pickupLoc.address,
            destination: destLoc.address,
            status: 'CONFIRMED',
            eta: 5,
            driverName: 'Assigned Driver', // Should come from vehicle/trip
            vehicleName: vehicles.find(v => v.id === vehicleId)?.name
        });
        toast({
            title: "Ride Booked!",
            description: "Your driver is on the way.",
        });
    } catch (e) {
        setIsSearching(false);
        toast({ title: "Error", description: "Booking failed", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          
          {/* Booking Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a Ride</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="Current Location" 
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="Where to?" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                {!activeBooking && (
                  <div className="pt-4">
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">Available Vehicles</h3>
                    <div className="space-y-3">
                      {availableVehicles.map(vehicle => (
                        <div 
                          key={vehicle.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Car className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{vehicle.name}</p>
                              <p className="text-xs text-muted-foreground">4 mins away</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹150-200</p>
                            <Button size="sm" variant="secondary" onClick={() => handleBook(vehicle.id)}>
                              Book
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Ride Card */}
            {activeBooking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Ride in Progress</span>
                      <Badge className="bg-primary animate-pulse">On the way</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Driver</p>
                        <p className="font-semibold">{activeBooking.driverName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Vehicle</p>
                        <p className="font-semibold">{activeBooking.vehicleName}</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold">ETA: {activeBooking.eta} mins</span>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => setActiveBooking(null)}>
                        Cancel Ride
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Map Area */}
          <div className="w-full lg:w-2/3 h-[600px] rounded-xl overflow-hidden border border-border">
             <LiveFleetMap 
               vehicles={vehicles} 
               height="100%"
             />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
