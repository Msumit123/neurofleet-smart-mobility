import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { User, UserRole } from '@/types';

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

// 🔥 UI ROLE → BACKEND STRING ROLE
const ROLE_LABEL_MAP: Record<UserRole, string> = {
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
  DRIVER: 'Driver',
  FLEET_MANAGER: 'Fleet Manager',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('neurofleetx_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // ================= LOGIN =================
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data: any = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Driver approval check
      if (
        data.roles?.includes('ROLE_DRIVER') &&
        data.approvalStatus !== 'APPROVED'
      ) {
        throw new Error('Your driver account is pending approval');
      }

      const loggedUser: User = {
        id: String(data.id),
        email: data.email,
        name: data.name,
        role: data.roles[0].replace('ROLE_', '') as UserRole,
        approvalStatus: data.approvalStatus,
        createdAt: new Date(),
      };

      setUser(loggedUser);
      localStorage.setItem('neurofleetx_user', JSON.stringify(loggedUser));
      localStorage.setItem('neurofleetx_token', data.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ================= REGISTER =================
  const register = useCallback(
    async (data: RegisterData) => {
      setIsLoading(true);

      try {
        const payload = {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          role: ROLE_LABEL_MAP[data.role], // 🔥 IMPORTANT
        };

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // ✅ SAFE RESPONSE HANDLING
        const text = await response.text();
        let responseData: any = {};

        if (text) {
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = {};
          }
        }

        if (!response.ok) {
          throw new Error(responseData.message || 'Registration failed');
        }

        // Driver approval flow
        if (data.role === 'DRIVER') {
          throw new Error('PENDING_APPROVAL');
        }

        // Auto login for others
        await login(data.email, data.password);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  // ================= LOGOUT =================
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('neurofleetx_user');
    localStorage.removeItem('neurofleetx_token');
  }, []);

  // ================= UPDATE USER =================
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

// ================= HOOK =================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ================= ROLE ROUTES =================
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
