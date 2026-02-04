import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  approvalStatus: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('neurofleetx_token');
      try {
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(await res.json());
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">List of all registered users in the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={user.approvalStatus === 'APPROVED' ? 'success' : 'secondary'}>
                        {user.approvalStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
