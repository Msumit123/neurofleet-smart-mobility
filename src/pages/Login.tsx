import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, User, Shield, Briefcase, Car, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roleOptions: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: 'CUSTOMER', label: 'Customer', icon: User, description: 'Book rides' },
  { value: 'DRIVER', label: 'Driver', icon: Car, description: 'Drive & earn' },
  { value: 'FLEET_MANAGER', label: 'Fleet Manager', icon: Briefcase, description: 'Manage vehicles' },
  { value: 'ADMIN', label: 'Admin', icon: Crown, description: 'System control' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Optional: Pre-fill demo credentials if they want, or just set focus
    // For now, we just use it for visual state.
    // But to be helpful, let's pre-fill if they click the role to match the "Demo" behavior logic 
    // BUT user asked for "category selection" like Register page.
    // Let's keep the manual input empty unless they use the "Quick Demo" buttons below.
  };

  const handleDemoLogin = (role: string) => {
    switch(role) {
      case 'ADMIN':
        setEmail('admin@neurofleetx.com');
        setPassword('admin123');
        break;
      case 'MANAGER':
        setEmail('manager@neurofleetx.com');
        setPassword('manager123');
        break;
      case 'DRIVER':
        setEmail('driver@neurofleetx.com');
        setPassword('driver123');
        break;
      case 'CUSTOMER':
        setEmail('customer@neurofleetx.com');
        setPassword('customer123');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      // Get the user after login to determine redirect
      const savedUser = localStorage.getItem('neurofleetx_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const redirectPath = from || getRoleDashboardPath(user.role);
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-info/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info shadow-glow-primary">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">NeuroFleetX</span>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="card-glass p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection Grid */}
            <div className="space-y-2">
              <Label>Select Account Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleRoleSelect(role.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all',
                      selectedRole === role.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <role.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo Login Shortcuts */}
          <div className="mt-8 space-y-4 border-t border-border pt-6">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 border-primary/20 hover:bg-primary/10"
                onClick={() => handleDemoLogin('ADMIN')}
              >
                <Shield className="h-4 w-4 text-primary" /> Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 border-info/20 hover:bg-info/10"
                onClick={() => handleDemoLogin('MANAGER')}
              >
                <Briefcase className="h-4 w-4 text-info" /> Manager
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 border-warning/20 hover:bg-warning/10"
                onClick={() => handleDemoLogin('DRIVER')}
              >
                <Car className="h-4 w-4 text-warning" /> Driver
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 border-success/20 hover:bg-success/10"
                onClick={() => handleDemoLogin('CUSTOMER')}
              >
                <User className="h-4 w-4 text-success" /> Customer
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
