import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { Badge } from '@/components/ui/badge';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import { mockVehicles, mockDashboardStats, mockPendingDrivers } from '@/data/mockData';

export default function AdminDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();
  const { telemetry } = useLiveTelemetry({ vehicles: mockVehicles });

  const stats = mockDashboardStats;

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
          />
          <StatCard
            title="Fleet Utilization"
            value={`${Math.round((stats.activeVehicles / stats.totalVehicles) * 100)}%`}
            subtitle="Vehicles in use"
            icon={Activity}
          />
        </div>

        {/* Map and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Fleet Map */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Fleet Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveFleetMap
                vehicles={mockVehicles}
                selectedVehicleId={selectedVehicle}
                onVehicleSelect={setSelectedVehicle}
                height="400px"
                updateInterval={1000}
              />
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-warning" />
                Pending Driver Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPendingDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-sm font-semibold text-primary-foreground">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {driver.licenseNumber}
                        </p>
                      </div>
                    </div>
                    <Badge variant="pending">Pending</Badge>
                  </motion.div>
                ))}
                {mockPendingDrivers.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No pending approvals
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Vehicle Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockVehicles.slice(0, 8).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-border bg-card/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.licensePlate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        vehicle.status === 'AVAILABLE'
                          ? 'available'
                          : vehicle.status === 'IN_USE'
                          ? 'in-use'
                          : vehicle.status === 'NEEDS_SERVICE'
                          ? 'needs-service'
                          : 'offline'
                      }
                    >
                      {vehicle.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {telemetry[vehicle.id] && (
                    <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                      <span>Speed: {Math.round(telemetry[vehicle.id].speed)} km/h</span>
                      <span>Fuel: {Math.round(telemetry[vehicle.id].fuelLevel)}%</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
