import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

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

  const demoCredentials = [
    { email: 'admin@neurofleetx.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@neurofleetx.com', password: 'manager123', role: 'Fleet Manager' },
    { email: 'driver@neurofleetx.com', password: 'driver123', role: 'Driver' },
    { email: 'customer@neurofleetx.com', password: 'customer123', role: 'Customer' },
  ];

  const fillCredentials = (email: string, pwd: string) => {
    setEmail(email);
    setPassword(pwd);
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

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Demo accounts (click to fill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillCredentials(cred.email, cred.password)}
                className="rounded-lg border border-border/50 bg-card/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-card/50 hover:text-foreground"
              >
                {cred.role}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
