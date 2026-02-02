import { Vehicle, Telemetry, User, Booking, Trip, DashboardStats, MaintenanceRecord } from '@/types';

// Bangalore coordinates for demo
const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

// Generate random position near Bangalore
const randomPosition = (spread = 0.1) => ({
  latitude: BANGALORE_CENTER.lat + (Math.random() - 0.5) * spread,
  longitude: BANGALORE_CENTER.lng + (Math.random() - 0.5) * spread,
});

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Swift Dzire #001',
    type: 'CAR',
    licensePlate: 'KA-01-AB-1234',
    model: 'Maruti Swift Dzire',
    status: 'AVAILABLE',
    capacity: 4,
    fuelType: 'PETROL',
    lastServiceDate: new Date('2024-12-15'),
    nextServiceDue: new Date('2025-03-15'),
  },
  {
    id: 'v2',
    name: 'Innova Crysta #002',
    type: 'VAN',
    licensePlate: 'KA-01-CD-5678',
    model: 'Toyota Innova Crysta',
    status: 'IN_USE',
    assignedDriverId: '3',
    assignedDriverName: 'Derek Driver',
    capacity: 7,
    fuelType: 'DIESEL',
    lastServiceDate: new Date('2024-11-20'),
    nextServiceDue: new Date('2025-02-20'),
  },
  {
    id: 'v3',
    name: 'Ather 450X #003',
    type: 'BIKE',
    licensePlate: 'KA-01-EF-9012',
    model: 'Ather 450X',
    status: 'AVAILABLE',
    capacity: 1,
    fuelType: 'ELECTRIC',
    lastServiceDate: new Date('2024-12-01'),
    nextServiceDue: new Date('2025-06-01'),
  },
  {
    id: 'v4',
    name: 'Bajaj RE #004',
    type: 'AUTO',
    licensePlate: 'KA-01-GH-3456',
    model: 'Bajaj RE Compact',
    status: 'NEEDS_SERVICE',
    capacity: 3,
    fuelType: 'CNG',
    lastServiceDate: new Date('2024-08-10'),
    nextServiceDue: new Date('2024-11-10'),
  },
  {
    id: 'v5',
    name: 'Honda City #005',
    type: 'CAR',
    licensePlate: 'KA-01-IJ-7890',
    model: 'Honda City 2024',
    status: 'IN_USE',
    assignedDriverId: '5',
    assignedDriverName: 'Priya Patel',
    capacity: 4,
    fuelType: 'PETROL',
    lastServiceDate: new Date('2024-12-20'),
    nextServiceDue: new Date('2025-03-20'),
  },
  {
    id: 'v6',
    name: 'Tata Nexon EV #006',
    type: 'CAR',
    licensePlate: 'KA-01-KL-2345',
    model: 'Tata Nexon EV',
    status: 'AVAILABLE',
    capacity: 5,
    fuelType: 'ELECTRIC',
    lastServiceDate: new Date('2024-12-05'),
    nextServiceDue: new Date('2025-06-05'),
  },
  {
    id: 'v7',
    name: 'TVS Jupiter #007',
    type: 'BIKE',
    licensePlate: 'KA-01-MN-6789',
    model: 'TVS Jupiter 125',
    status: 'OFFLINE',
    capacity: 1,
    fuelType: 'PETROL',
  },
  {
    id: 'v8',
    name: 'Mahindra XUV700 #008',
    type: 'VAN',
    licensePlate: 'KA-01-OP-0123',
    model: 'Mahindra XUV700',
    status: 'AVAILABLE',
    capacity: 7,
    fuelType: 'DIESEL',
    lastServiceDate: new Date('2024-12-10'),
    nextServiceDue: new Date('2025-03-10'),
  },
];

export const mockTelemetry: Record<string, Telemetry> = {
  v1: {
    vehicleId: 'v1',
    speed: 0,
    fuelLevel: 85,
    latitude: 12.9352,
    longitude: 77.6245,
    heading: 45,
    engineStatus: 'OFF',
    timestamp: new Date(),
  },
  v2: {
    vehicleId: 'v2',
    speed: 42,
    fuelLevel: 65,
    latitude: 12.9716,
    longitude: 77.5946,
    heading: 180,
    engineStatus: 'ON',
    timestamp: new Date(),
  },
  v3: {
    vehicleId: 'v3',
    speed: 0,
    fuelLevel: 100,
    batteryLevel: 92,
    latitude: 12.9141,
    longitude: 77.6411,
    heading: 90,
    engineStatus: 'OFF',
    timestamp: new Date(),
  },
  v4: {
    vehicleId: 'v4',
    speed: 0,
    fuelLevel: 30,
    latitude: 12.9783,
    longitude: 77.5823,
    heading: 270,
    engineStatus: 'OFF',
    timestamp: new Date(),
  },
  v5: {
    vehicleId: 'v5',
    speed: 55,
    fuelLevel: 72,
    latitude: 12.9256,
    longitude: 77.5851,
    heading: 135,
    engineStatus: 'ON',
    timestamp: new Date(),
  },
  v6: {
    vehicleId: 'v6',
    speed: 0,
    fuelLevel: 100,
    batteryLevel: 78,
    latitude: 12.9611,
    longitude: 77.6387,
    heading: 0,
    engineStatus: 'OFF',
    timestamp: new Date(),
  },
  v8: {
    vehicleId: 'v8',
    speed: 0,
    fuelLevel: 90,
    latitude: 12.9896,
    longitude: 77.5514,
    heading: 225,
    engineStatus: 'OFF',
    timestamp: new Date(),
  },
};

export const mockPendingDrivers: User[] = [
  {
    id: 'pd1',
    email: 'rahul.kumar@email.com',
    name: 'Rahul Kumar',
    role: 'DRIVER',
    phone: '+91 98765 43210',
    licenseNumber: 'DL-2024-789',
    approvalStatus: 'PENDING',
    createdAt: new Date('2025-01-28'),
  },
  {
    id: 'pd2',
    email: 'sneha.reddy@email.com',
    name: 'Sneha Reddy',
    role: 'DRIVER',
    phone: '+91 87654 32109',
    licenseNumber: 'DL-2024-456',
    approvalStatus: 'PENDING',
    createdAt: new Date('2025-01-30'),
  },
  {
    id: 'pd3',
    email: 'amit.sharma@email.com',
    name: 'Amit Sharma',
    role: 'DRIVER',
    phone: '+91 76543 21098',
    licenseNumber: 'DL-2024-123',
    approvalStatus: 'PENDING',
    createdAt: new Date('2025-02-01'),
  },
];

export const mockAllUsers: User[] = [
  {
    id: '1',
    email: 'admin@neurofleetx.com',
    name: 'Alex Administrator',
    role: 'ADMIN',
    phone: '+1 555-0100',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'manager@neurofleetx.com',
    name: 'Morgan Fleet',
    role: 'FLEET_MANAGER',
    phone: '+1 555-0101',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'driver@neurofleetx.com',
    name: 'Derek Driver',
    role: 'DRIVER',
    phone: '+1 555-0102',
    licenseNumber: 'DL-2024-001',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    email: 'customer@neurofleetx.com',
    name: 'Casey Customer',
    role: 'CUSTOMER',
    phone: '+1 555-0103',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    email: 'priya.patel@email.com',
    name: 'Priya Patel',
    role: 'DRIVER',
    phone: '+91 99887 76655',
    licenseNumber: 'DL-2024-005',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-03-01'),
  },
  ...mockPendingDrivers,
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    customerId: '4',
    customerName: 'Casey Customer',
    vehicleId: 'v2',
    vehicleType: 'CAR',
    pickup: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road, Bangalore',
    },
    destination: {
      latitude: 12.9352,
      longitude: 77.6245,
      address: 'Indiranagar, Bangalore',
    },
    status: 'IN_PROGRESS',
    estimatedFare: 350,
    estimatedDuration: 25,
    estimatedDistance: 8.5,
    createdAt: new Date(),
    confirmedAt: new Date(),
  },
];

export const mockTrips: Trip[] = [
  {
    id: 't1',
    bookingId: 'b1',
    driverId: '3',
    driverName: 'Derek Driver',
    vehicleId: 'v2',
    vehicleName: 'Innova Crysta #002',
    customerId: '4',
    customerName: 'Casey Customer',
    pickup: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road, Bangalore',
    },
    destination: {
      latitude: 12.9352,
      longitude: 77.6245,
      address: 'Indiranagar, Bangalore',
    },
    status: 'IN_PROGRESS',
    startedAt: new Date(),
    eta: 15,
    currentLocation: {
      latitude: 12.9516,
      longitude: 77.6046,
      address: 'Trinity Circle, Bangalore',
    },
    route: [
      [12.9716, 77.5946],
      [12.9616, 77.6046],
      [12.9516, 77.6145],
      [12.9416, 77.6195],
      [12.9352, 77.6245],
    ],
  },
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'm1',
    vehicleId: 'v4',
    type: 'REPAIR',
    description: 'Engine tuning and oil change',
    cost: 2500,
    scheduledDate: new Date('2025-02-05'),
    status: 'SCHEDULED',
  },
  {
    id: 'm2',
    vehicleId: 'v2',
    type: 'ROUTINE',
    description: 'Regular service at 50,000 km',
    cost: 8000,
    scheduledDate: new Date('2025-02-20'),
    status: 'SCHEDULED',
  },
  {
    id: 'm3',
    vehicleId: 'v1',
    type: 'INSPECTION',
    description: 'Annual vehicle inspection',
    cost: 1500,
    scheduledDate: new Date('2025-03-15'),
    status: 'SCHEDULED',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalVehicles: mockVehicles.length,
  activeVehicles: mockVehicles.filter(v => v.status === 'IN_USE').length,
  totalDrivers: mockAllUsers.filter(u => u.role === 'DRIVER').length,
  activeDrivers: mockVehicles.filter(v => v.assignedDriverId).length,
  totalTrips: 1247,
  completedTrips: 1189,
  pendingApprovals: mockPendingDrivers.length,
  vehiclesNeedingService: mockVehicles.filter(v => v.status === 'NEEDS_SERVICE').length,
  revenueToday: 45600,
  averageRating: 4.7,
};

// Simulated telemetry update function
export function updateTelemetry(telemetry: Telemetry): Telemetry {
  const isMoving = telemetry.engineStatus === 'ON';
  
  return {
    ...telemetry,
    speed: isMoving 
      ? Math.max(0, Math.min(80, telemetry.speed + (Math.random() - 0.5) * 10)) 
      : 0,
    fuelLevel: Math.max(0, telemetry.fuelLevel - (isMoving ? 0.05 : 0)),
    batteryLevel: telemetry.batteryLevel 
      ? Math.max(0, telemetry.batteryLevel - (isMoving ? 0.1 : 0))
      : undefined,
    latitude: isMoving 
      ? telemetry.latitude + (Math.random() - 0.5) * 0.001 
      : telemetry.latitude,
    longitude: isMoving 
      ? telemetry.longitude + (Math.random() - 0.5) * 0.001 
      : telemetry.longitude,
    heading: isMoving 
      ? (telemetry.heading + (Math.random() - 0.5) * 20) % 360 
      : telemetry.heading,
    timestamp: new Date(),
  };
}
