import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import FleetMap from '@/components/map/FleetMap';
import { mockVehicles } from '@/data/mockData';

export default function DriverNavigation() {
  // Mock data for demo
  const currentVehicle = mockVehicles[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-muted-foreground">Live route guidance</p>
        </div>

        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
             <FleetMap 
                vehicles={[currentVehicle]}
                height="100%"
             />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
