import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Map, Wrench, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LiveFleetMap from '@/components/map/LiveFleetMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';
import { mockVehicles, mockMaintenanceRecords, mockDashboardStats } from '@/data/mockData';
import { VehicleStatus } from '@/types';

export default function ManagerDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'ALL'>('ALL');
  const { telemetry } = useLiveTelemetry({ vehicles: mockVehicles });

  const filteredVehicles = statusFilter === 'ALL'
    ? mockVehicles
    : mockVehicles.filter(v => v.status === statusFilter);

  const vehiclesByStatus = {
    available: mockVehicles.filter(v => v.status === 'AVAILABLE').length,
    inUse: mockVehicles.filter(v => v.status === 'IN_USE').length,
    needsService: mockVehicles.filter(v => v.status === 'NEEDS_SERVICE').length,
    offline: mockVehicles.filter(v => v.status === 'OFFLINE').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Fleet Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your fleet in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Available"
            value={vehiclesByStatus.available}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="In Use"
            value={vehiclesByStatus.inUse}
            icon={Car}
            variant="info"
          />
          <StatCard
            title="Needs Service"
            value={vehiclesByStatus.needsService}
            icon={Wrench}
            variant="warning"
          />
          <StatCard
            title="Offline"
            value={vehiclesByStatus.offline}
            icon={AlertTriangle}
          />
        </div>

        {/* Map with Filter */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Live Fleet Tracking
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(['ALL', 'AVAILABLE', 'IN_USE', 'NEEDS_SERVICE'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LiveFleetMap
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicle}
              onVehicleSelect={setSelectedVehicle}
              height="450px"
              updateInterval={1000}
            />
          </CardContent>
        </Card>

        {/* Vehicle Details and Maintenance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Selected Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVehicle ? (
                (() => {
                  const vehicle = mockVehicles.find(v => v.id === selectedVehicle);
                  const vehicleTelemetry = telemetry[selectedVehicle];
                  if (!vehicle) return null;

                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                          <p className="text-muted-foreground">{vehicle.licensePlate}</p>
                        </div>
                        <Badge
                          variant={
                            vehicle.status === 'AVAILABLE' ? 'available' :
                            vehicle.status === 'IN_USE' ? 'in-use' :
                            vehicle.status === 'NEEDS_SERVICE' ? 'needs-service' : 'offline'
                          }
                        >
                          {vehicle.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {vehicleTelemetry && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">Speed</p>
                            <p className="text-2xl font-bold text-primary">
                              {Math.round(vehicleTelemetry.speed)} <span className="text-sm">km/h</span>
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">Fuel Level</p>
                            <p className="text-2xl font-bold text-success">
                              {Math.round(vehicleTelemetry.fuelLevel)}<span className="text-sm">%</span>
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">Engine</p>
                            <p className="text-lg font-semibold">{vehicleTelemetry.engineStatus}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">Heading</p>
                            <p className="text-lg font-semibold">{Math.round(vehicleTelemetry.heading)}°</p>
                          </div>
                        </div>
                      )}

                      {vehicle.assignedDriverName && (
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-sm text-muted-foreground">Assigned Driver</p>
                          <p className="font-semibold">{vehicle.assignedDriverName}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })()
              ) : (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  <p>Select a vehicle on the map to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-warning" />
                Scheduled Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockMaintenanceRecords.map((record, index) => {
                  const vehicle = mockVehicles.find(v => v.id === record.vehicleId);
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div>
                        <p className="font-medium">{vehicle?.name || 'Unknown Vehicle'}</p>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled: {record.scheduledDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={record.type === 'REPAIR' ? 'warning' : 'info'}>
                          {record.type}
                        </Badge>
                        <p className="mt-1 text-sm font-semibold">₹{record.cost}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
