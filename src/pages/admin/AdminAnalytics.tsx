import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">System performance and usage statistics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
             <CardHeader>
               <CardTitle>Revenue Overview</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                 <p className="text-muted-foreground">Revenue Chart Placeholder</p>
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <CardTitle>Trip Statistics</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                 <p className="text-muted-foreground">Trip Stats Chart Placeholder</p>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
