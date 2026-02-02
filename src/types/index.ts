// NeuroFleetX Types

export type UserRole = 'ADMIN' | 'FLEET_MANAGER' | 'DRIVER' | 'CUSTOMER';

export type DriverApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'NEEDS_SERVICE' | 'OFFLINE';

export type TripStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  // Driver specific
  licenseNumber?: string;
  approvalStatus?: DriverApprovalStatus;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'CAR' | 'BIKE' | 'AUTO' | 'VAN';
  licensePlate: string;
  model: string;
  status: VehicleStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  capacity: number;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG';
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  imageUrl?: string;
}

export interface Telemetry {
  vehicleId: string;
  speed: number; // km/h
  fuelLevel: number; // percentage
  batteryLevel?: number; // for electric
  latitude: number;
  longitude: number;
  heading: number; // degrees
  engineStatus: 'ON' | 'OFF' | 'IDLE';
  timestamp: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId?: string;
  vehicleType: Vehicle['type'];
  pickup: Location;
  destination: Location;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedFare: number;
  actualFare?: number;
  estimatedDuration: number; // minutes
  estimatedDistance: number; // km
  createdAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

export interface Trip {
  id: string;
  bookingId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  customerId: string;
  customerName: string;
  pickup: Location;
  destination: Location;
  status: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
  route?: [number, number][]; // Array of lat/lng pairs
  currentLocation?: Location;
  eta?: number; // minutes
}

export interface Rating {
  id: string;
  tripId: string;
  customerId: string;
  driverId: string;
  rating: number; // 1-5
  feedback?: string;
  createdAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION';
  description: string;
  cost: number;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalTrips: number;
  completedTrips: number;
  pendingApprovals: number;
  vehiclesNeedingService: number;
  revenueToday: number;
  averageRating: number;
}
