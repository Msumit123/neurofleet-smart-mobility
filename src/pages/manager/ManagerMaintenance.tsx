import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  status: string;
}

export default function ManagerMaintenance() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    const token = localStorage.getItem('neurofleetx_token');
    const res = await fetch('/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const all: Vehicle[] = await res.json();
      setVehicles(all.filter(v => v.status === 'NEEDS_SERVICE'));
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const markServiced = async (vehicle: Vehicle) => {
    const token = localStorage.getItem('neurofleetx_token');
    // We need to update status to AVAILABLE
    // Note: In real app, we should probably PATCH only status. Here we PUT full object (simplified)
    // But we don't have full object here. Let's fetch it first or use what we have.
    // Ideally backend should have specific endpoint /api/vehicles/{id}/service
    // For now, let's just do a PUT with the fields we have + others preserved if possible, 
    // OR just minimal fields if backend supports partial update (it uses save(), so it might overwrite nulls if we send incomplete obj).
    // Let's fetch full object first.
    
    try {
        const getRes = await fetch(`/api/vehicles/${vehicle.id}`, { headers: { Authorization: `Bearer ${token}` } });
        // Since we don't have GET /id implemented in controller explicitly (only getAll), 
        // wait, we don't have GET /api/vehicles/{id} in VehicleController! We only have getAll.
        // Let's implement GET /{id} in backend first or filter from getAll.
        
        // Quick fix: filter from all vehicles again
        const allRes = await fetch('/api/vehicles', { headers: { Authorization: `Bearer ${token}` } });
        const all: any[] = await allRes.json();
        const fullVehicle = all.find(v => v.id === vehicle.id);
        
        if (fullVehicle) {
            fullVehicle.status = 'AVAILABLE';
            await fetch(`/api/vehicles/${vehicle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(fullVehicle)
            });
            toast({ title: "Success", description: "Vehicle marked as serviced" });
            fetchVehicles();
        }
    } catch (e) {
        toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Vehicles requiring service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-warning" />
              Service Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No vehicles need service currently.</p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map((v) => (
                    <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>{v.licensePlate}</TableCell>
                        <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-green-600" onClick={() => markServiced(v)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Serviced
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
