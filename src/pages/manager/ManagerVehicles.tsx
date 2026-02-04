import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { VehicleTable } from '@/components/admin/VehicleTable';

export default function ManagerVehicles() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fleet Vehicles</h1>
          <p className="text-muted-foreground">View and manage fleet status</p>
        </div>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Car className="h-5 w-5" />
               Vehicle List
             </CardTitle>
          </CardHeader>
          <CardContent>
             <VehicleTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
