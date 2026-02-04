import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Car,
  Map,
  Shield,
  Users,
  Gauge,
  ArrowRight,
  ChevronRight,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';

const features = [
  {
    icon: Map,
    title: 'Real-Time Tracking',
    description: 'Track your entire fleet with live GPS updates and route visualization.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control.',
  },
  {
    icon: Gauge,
    title: 'Live Telemetry',
    description: 'Monitor speed, fuel, and vehicle health in real-time.',
  },
  {
    icon: Users,
    title: 'Multi-Role Platform',
    description: 'Separate dashboards for admins, managers, drivers, and customers.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Vehicles' },
  { value: '50K+', label: 'Daily Trips' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9', label: 'User Rating' },
];

export default function Landing() {
  const { user, isAuthenticated } = useAuth();

  // If user is already logged in, redirect to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info shadow-glow-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient-primary">NeuroFleetX</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-info/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Zap className="h-4 w-4" />
                AI-Powered Fleet Intelligence
              </div>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                <span className="text-gradient-primary">Smart Fleet</span>
                <br />
                <span className="text-foreground">Management for the</span>
                <br />
                <span className="text-gradient-accent">Modern City</span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Transform your urban mobility operations with real-time tracking, 
                AI-driven optimization, and seamless multi-role management.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/register">
                  <Button variant="hero" size="xl">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl">
                    View Demo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-gradient-primary md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Hero Image/Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto px-4 pb-16"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <div className="aspect-video bg-gradient-to-br from-card to-muted p-8">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-info">
                    <Map className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <p className="text-xl font-semibold">Live Fleet Dashboard</p>
                  <p className="text-muted-foreground mb-4">Login to access the interactive map and real-time fleet data.</p>
                  <Link to="/login">
                    <Button variant="default" size="lg">
                      Login Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything You Need to
              <span className="text-gradient-primary"> Manage Your Fleet</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for urban mobility operators
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow-primary"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Dashboards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <span className="text-gradient-primary">Four Powerful</span> Dashboards
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tailored experiences for every user role
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { role: 'Admin', icon: Shield, color: 'primary', desc: 'Full control over fleet, users, and approvals' },
              { role: 'Fleet Manager', icon: Car, color: 'info', desc: 'Track vehicles and manage maintenance' },
              { role: 'Driver', icon: MapPin, color: 'success', desc: 'Navigation, telemetry, and trip management' },
              { role: 'Customer', icon: Star, color: 'accent', desc: 'Book rides and track in real-time' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-gradient-to-br from-card to-muted p-6 text-center"
              >
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-${item.color}/20`}>
                  <item.icon className={`h-7 w-7 text-${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{item.role}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary/10 via-info/10 to-accent/10 p-8 text-center md:p-12"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Transform Your Fleet?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of operators already using NeuroFleetX
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Try Demo Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-info">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">NeuroFleetX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NeuroFleetX. AI-Driven Fleet Management Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
