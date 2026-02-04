import { Vehicle } from '@/types';

const API_BASE = '/api';

export const getAvailableVehicles = async (): Promise<Vehicle[]> => {
  const token = localStorage.getItem('neurofleetx_token');
  const response = await fetch(`${API_BASE}/vehicles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  const allVehicles: Vehicle[] = await response.json();
  // Filter for available vehicles (or all if needed for map)
  // For Customer, usually we want AVAILABLE.
  return allVehicles.filter(v => v.status === 'AVAILABLE');
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const token = localStorage.getItem('neurofleetx_token');
  const response = await fetch(`${API_BASE}/vehicles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  return await response.json();
};

export const createTrip = async (bookingData: any) => {
  const token = localStorage.getItem('neurofleetx_token');
  // Transform to backend format
  const payload = {
    vehicleId: bookingData.vehicleId,
    customerId: bookingData.customerId,
    customerName: bookingData.customerName,
    pickupLat: bookingData.pickup.latitude || 0,
    pickupLng: bookingData.pickup.longitude || 0,
    pickupAddress: bookingData.pickup.address || '',
    destLat: bookingData.destination.latitude || 0,
    destLng: bookingData.destination.longitude || 0,
    destAddress: bookingData.destination.address || '',
    status: 'PENDING'
  };

  const response = await fetch(`${API_BASE}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed to create trip');
  return await response.json();
};

export const getActiveTrip = async (driverId: string) => {
  const token = localStorage.getItem('neurofleetx_token');
  const response = await fetch(`${API_BASE}/trips/driver/${driverId}/active`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 204) return null;
  if (!response.ok) throw new Error('Failed to fetch active trip');
  
  const trip = await response.json();
  // Transform back to frontend format if needed, or update frontend to use flat structure
  // For now, let's just return as is and handle in component or transform here.
  return {
    ...trip,
    pickup: { latitude: trip.pickupLat, longitude: trip.pickupLng, address: trip.pickupAddress },
    destination: { latitude: trip.destLat, longitude: trip.destLng, address: trip.destAddress },
    // Map other fields
  };
};

export const getAssignedVehicle = async (driverId: string) => {
  const token = localStorage.getItem('neurofleetx_token');
  const response = await fetch(`${API_BASE}/vehicles/driver/${driverId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch assigned vehicle');
  return await response.json();
};

export const getCustomerTrips = async (customerId: string) => {
  const token = localStorage.getItem('neurofleetx_token');
  const response = await fetch(`${API_BASE}/trips/customer/${customerId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch trips');
  return await response.json();
};
