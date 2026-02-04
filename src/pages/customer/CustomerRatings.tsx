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
               <div className="p-4 bg-yellow-100 rounded-full">
                 <Star className="h-8 w-8 text-yellow-500" />
               </div>
               <h3 className="text-xl font-semibold">4.8 Average Rating</h3>
               <p className="text-muted-foreground text-center max-w-sm">
                 You are a 5-star passenger! Keep it up.
               </p>
             </div>
           </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
