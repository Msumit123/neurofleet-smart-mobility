import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerTrips } from '@/lib/api';

export default function CustomerTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
        getCustomerTrips(user.id).then(setTrips).catch(console.error);
    }
  }, [user?.id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Ride history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? <p>No trips yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip: any) => (
                <TableRow key={trip.id}>
                  <TableCell>{new Date(trip.startTime).toLocaleString()}</TableCell>
                  <TableCell>{trip.pickupAddress}</TableCell>
                  <TableCell>{trip.destAddress}</TableCell>
                  <TableCell><Badge>{trip.status}</Badge></TableCell>
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
