import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { DriverApprovalTable } from '@/components/admin/DriverApprovalTable';

export default function AdminApprovals() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Driver Approvals</h1>
          <p className="text-muted-foreground">
            Verify and approve new driver registrations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DriverApprovalTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
