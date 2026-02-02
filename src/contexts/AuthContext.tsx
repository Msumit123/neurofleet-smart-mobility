import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, DriverApprovalStatus } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  licenseNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@neurofleetx.com': {
    id: '1',
    email: 'admin@neurofleetx.com',
    password: 'admin123',
    name: 'Alex Administrator',
    role: 'ADMIN',
    phone: '+1 555-0100',
    createdAt: new Date('2024-01-01'),
  },
  'manager@neurofleetx.com': {
    id: '2',
    email: 'manager@neurofleetx.com',
    password: 'manager123',
    name: 'Morgan Fleet',
    role: 'FLEET_MANAGER',
    phone: '+1 555-0101',
    createdAt: new Date('2024-01-15'),
  },
  'driver@neurofleetx.com': {
    id: '3',
    email: 'driver@neurofleetx.com',
    password: 'driver123',
    name: 'Derek Driver',
    role: 'DRIVER',
    phone: '+1 555-0102',
    licenseNumber: 'DL-2024-001',
    approvalStatus: 'APPROVED',
    createdAt: new Date('2024-02-01'),
  },
  'customer@neurofleetx.com': {
    id: '4',
    email: 'customer@neurofleetx.com',
    password: 'customer123',
    name: 'Casey Customer',
    role: 'CUSTOMER',
    phone: '+1 555-0103',
    createdAt: new Date('2024-02-15'),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('neurofleetx_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }

    // Check driver approval status
    if (mockUser.role === 'DRIVER' && mockUser.approvalStatus !== 'APPROVED') {
      setIsLoading(false);
      throw new Error('Your driver account is pending approval');
    }

    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);
    localStorage.setItem('neurofleetx_user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS[data.email.toLowerCase()]) {
      setIsLoading(false);
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      approvalStatus: data.role === 'DRIVER' ? 'PENDING' : undefined,
      createdAt: new Date(),
    };

    // For drivers, they need approval before login
    if (data.role === 'DRIVER') {
      setIsLoading(false);
      // Don't log them in, show message about pending approval
      throw new Error('PENDING_APPROVAL');
    }

    setUser(newUser);
    localStorage.setItem('neurofleetx_user', JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('neurofleetx_user');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('neurofleetx_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Role-based route helper
export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'FLEET_MANAGER':
      return '/manager/dashboard';
    case 'DRIVER':
      return '/driver/dashboard';
    case 'CUSTOMER':
      return '/customer/dashboard';
    default:
      return '/';
  }
}
