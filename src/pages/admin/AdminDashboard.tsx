import { useState, useEffect } from 'react';
import {
  Car,
  Users,
  UserCheck,
  Wrench,
  TrendingUp,
  DollarSign,
  Star,
  Activity,
  MapPin,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LiveFleetMap from '@/components/map/LiveFleetMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllVehicles } from '@/lib/api';
import { Vehicle } from '@/types';

// New interface for API stats
interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingApprovals: number;
  vehiclesNeedingService: number;
  // Keep some mock data for fields we haven't implemented yet
  revenueToday: number;
  averageRating: number;
  totalTrips: number;
  completedTrips: number;
}

export default function AdminDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    pendingApprovals: 0,
    vehiclesNeedingService: 0,
    revenueToday: 45600, // Mock
    averageRating: 4.7, // Mock
    totalTrips: 1247, // Mock
    completedTrips: 1189 // Mock
  });

  useEffect(() => {
    const fetchVehicles = async () => {
        try {
            const data = await getAllVehicles();
            setVehicles(data);
        } catch (e) {
            console.error(e);
        }
    };
    fetchVehicles();

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('neurofleetx_token');
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your entire fleet operations at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            subtitle={`${stats.activeVehicles} active`}
            icon={Car}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Drivers"
            value={stats.totalDrivers}
            subtitle={`${stats.activeDrivers} on duty`}
            icon={Users}
            variant="info"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            subtitle="Driver registrations"
            icon={UserCheck}
            variant="warning"
          />
          <StatCard
            title="Needs Service"
            value={stats.vehiclesNeedingService}
            subtitle="Vehicles requiring maintenance"
            icon={Wrench}
            variant="warning"
          />
        </div>

        {/* Second row stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.revenueToday.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Trips"
            value={stats.totalTrips.toLocaleString()}
            subtitle={`${stats.completedTrips} completed`}
            icon={TrendingUp}
            variant="primary"
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            subtitle="Customer satisfaction"
            icon={Star}
            variant="success"
            trend={{ value: 4, isPositive: true }}
          />
          <StatCard
            title="Fleet Utilization"
            value={stats.totalVehicles > 0 ? `${Math.round((stats.activeVehicles / stats.totalVehicles) * 100)}%` : '0%'}
            subtitle="Vehicles in use"
            icon={Activity}
          />
        </div>

        {/* Map and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Fleet Map */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Fleet Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveFleetMap
                vehicles={vehicles}
                selectedVehicleId={selectedVehicle}
                onVehicleSelect={setSelectedVehicle}
                height="400px"
                updateInterval={1000}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
