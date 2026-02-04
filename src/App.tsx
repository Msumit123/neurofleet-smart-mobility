import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Role-based Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerVehicles from "./pages/manager/ManagerVehicles";
import ManagerMaintenance from "./pages/manager/ManagerMaintenance";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverVehicle from "./pages/driver/DriverVehicle";
import DriverNavigation from "./pages/driver/DriverNavigation";
import DriverTrips from "./pages/driver/DriverTrips";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerBook from "./pages/customer/CustomerBook";
import CustomerTrips from "./pages/customer/CustomerTrips";
import CustomerRatings from "./pages/customer/CustomerRatings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminVehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fleet Manager Routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/map"
              element={
                <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/vehicles"
              element={
                <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                  <ManagerVehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/maintenance"
              element={
                <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                  <ManagerMaintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/*"
              element={
                <ProtectedRoute allowedRoles={['FLEET_MANAGER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/navigation"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverNavigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/vehicle"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/trips"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/*"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/book"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/trips"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/ratings"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerRatings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
