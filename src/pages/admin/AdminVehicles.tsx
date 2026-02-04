import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { VehicleTable } from '@/components/admin/VehicleTable';

export default function AdminVehicles() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Add, update, and manage your fleet vehicles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              All Vehicles
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
