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
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  licenseNumber?: string;
  approvalStatus?: string;
}

export function DriverApprovalTable() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const token = localStorage.getItem('neurofleetx_token');
    const res = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const allUsers: User[] = await res.json();
      // Filter for drivers only
      setUsers(allUsers.filter(u => u.role === 'DRIVER'));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (id: number, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('neurofleetx_token');
    const res = await fetch(`/api/users/${id}/${action}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      toast({ title: 'Success', description: `Driver ${action}d successfully` });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Driver Approvals</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.licenseNumber || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={
                    user.approvalStatus === 'APPROVED' ? 'success' : 
                    user.approvalStatus === 'REJECTED' ? 'destructive' : 'warning'
                  }>
                    {user.approvalStatus || 'UNKNOWN'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {user.approvalStatus === 'PENDING' && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleApproval(user.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleApproval(user.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
