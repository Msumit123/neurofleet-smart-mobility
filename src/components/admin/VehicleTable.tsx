import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  licensePlate: string;
  type: string;
  model: string;
  status: string;
  capacity: number;
  fuelType: string;
}

export function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const { toast } = useToast();

  const fetchVehicles = async () => {
    const token = localStorage.getItem('neurofleetx_token');
    const res = await fetch('/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setVehicles(await res.json());
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('neurofleetx_token');
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `/api/vehicles/${formData.id}` : '/api/vehicles';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast({ title: 'Success', description: 'Vehicle saved successfully' });
      setIsOpen(false);
      setFormData({});
      fetchVehicles();
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('neurofleetx_token');
    await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchVehicles();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vehicle Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})}><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Edit' : 'Add'} Vehicle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>License Plate</Label>
                  <Input value={formData.licensePlate || ''} onChange={e => setFormData({...formData, licensePlate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select onValueChange={v => setFormData({...formData, type: v})} value={formData.type}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="BIKE">Bike</SelectItem>
                      <SelectItem value="VAN">Van</SelectItem>
                      <SelectItem value="AUTO">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select onValueChange={v => setFormData({...formData, status: v})} value={formData.status}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="IN_USE">In Use</SelectItem>
                      <SelectItem value="NEEDS_SERVICE">Needs Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setFormData(vehicle); setIsOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(vehicle.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
