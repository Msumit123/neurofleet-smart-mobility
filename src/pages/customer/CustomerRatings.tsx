import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function CustomerRatings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Ratings</h1>
          <p className="text-muted-foreground">Feedback you've given</p>
        </div>

        <Card>
           <CardContent className="pt-6">
             <div className="flex flex-col items-center justify-center space-y-4 py-8">
               <div className="p-4 bg-muted rounded-full">
                 <Star className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="text-xl font-semibold">No Ratings Yet</h3>
               <p className="text-muted-foreground text-center max-w-sm">
                 Your ratings will appear here after you complete trips.
               </p>
             </div>
           </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
