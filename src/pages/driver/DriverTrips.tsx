import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DriverTrips() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trip History</h1>
          <p className="text-muted-foreground">Your completed trips</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Past Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mock Data */}
                <TableRow>
                  <TableCell>2024-02-01</TableCell>
                  <TableCell>Central Station</TableCell>
                  <TableCell>Airport Terminal 1</TableCell>
                  <TableCell>₹450</TableCell>
                  <TableCell><Badge variant="success">Completed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-02</TableCell>
                  <TableCell>Tech Park</TableCell>
                  <TableCell>City Mall</TableCell>
                  <TableCell>₹120</TableCell>
                  <TableCell><Badge variant="success">Completed</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
