import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import FleetMap from '@/components/map/FleetMap';
import { useAuth } from '@/contexts/AuthContext';
import { getAssignedVehicle } from '@/lib/api';
import { Vehicle } from '@/types';
import { useState, useEffect } from 'react';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';

export default function DriverNavigation() {
  const { user } = useAuth();
  const [assignedVehicle, setAssignedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
        if (user?.id) {
            try {
                const v = await getAssignedVehicle(user.id);
                setAssignedVehicle(v);
            } catch (e) {
                console.error(e);
            }
        }
    };
    fetchVehicle();
  }, [user?.id]);

  const { telemetry } = useLiveTelemetry({ 
    vehicles: assignedVehicle ? [assignedVehicle] : [],
    enabled: true 
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-muted-foreground">Live route guidance</p>
        </div>

        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
             {assignedVehicle ? (
                 <FleetMap 
                    vehicles={[assignedVehicle]}
                    telemetry={{ [assignedVehicle.id]: telemetry[assignedVehicle.id] }}
                    height="100%"
                 />
             ) : (
                 <div className="flex items-center justify-center h-full">
                     <p>No vehicle assigned.</p>
                 </div>
             )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
