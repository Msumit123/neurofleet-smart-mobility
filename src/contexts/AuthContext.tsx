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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('neurofleetx_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Check driver approval status from response
      if (data.roles.includes('DRIVER') && data.approvalStatus !== 'APPROVED') {
        throw new Error('Your driver account is pending approval');
      }

      const userRole = data.roles[0] as UserRole; // Assuming single role

      const user: User = {
        id: data.id.toString(),
        email: data.email,
        name: data.name,
        role: userRole,
        approvalStatus: data.approvalStatus,
        createdAt: new Date(), // Backend doesn't return this yet in JwtResponse, using current time
      };

      setUser(user);
      localStorage.setItem('neurofleetx_user', JSON.stringify(user));
      localStorage.setItem('neurofleetx_token', data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      // For drivers, they need approval before login
      if (data.role === 'DRIVER') {
        // Don't log them in, show message about pending approval
        throw new Error('PENDING_APPROVAL');
      }

      // Auto login after registration for non-drivers? 
      // Current flow seems to expect login after register or auto-login.
      // Let's just return success and let the user login or auto-login.
      // The original mock implementation did:
      // setUser(newUser); localStorage.setItem...
      
      // Since backend doesn't return token on signup, we can either:
      // 1. Call login immediately
      // 2. Redirect to login page
      
      // I'll call login immediately to match the previous behavior
      await login(data.email, data.password);

    } catch (error: any) {
      // If error is PENDING_APPROVAL, rethrow it to be handled by the component
      if (error.message === 'PENDING_APPROVAL') {
        throw error;
      }
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('neurofleetx_user');
    localStorage.removeItem('neurofleetx_token');
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
