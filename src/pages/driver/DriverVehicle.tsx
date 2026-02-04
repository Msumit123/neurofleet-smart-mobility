import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Fuel, Gauge, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  status: string;
  fuelType: string;
  capacity: number;
}

export default function DriverVehicle() {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!user) return;
      const token = localStorage.getItem('neurofleetx_token');
      try {
        const res = await fetch(`/api/vehicles/driver/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setVehicle(await res.json());
        } else {
          setVehicle(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [user]);

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Vehicle</h1>
          <p className="text-muted-foreground">Details of your assigned vehicle</p>
        </div>

        {vehicle ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">License Plate</span>
                  <span className="font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fuel Type</span>
                  <span className="font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{vehicle.capacity} Seats</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : 'secondary'}>
                    {vehicle.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                 <CardTitle>Live Telemetry (Simulated)</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2"><Gauge className="h-4 w-4" /> Speed</span>
                      <span className="font-bold">0 km/h</span>
                    </div>
                    <Progress value={0} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2"><Fuel className="h-4 w-4" /> Fuel Level</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <Progress value={85} className="bg-muted" />
                 </div>
               </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold">No Vehicle Assigned</h3>
              <p className="text-muted-foreground">Please contact your fleet manager to get a vehicle assigned.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
