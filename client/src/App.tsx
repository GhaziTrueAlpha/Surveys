import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import PendingApproval from "@/pages/PendingApproval";

// Admin pages
import AdminSurveys from "@/pages/admin/Surveys";
import AdminVendors from "@/pages/admin/Vendors";
import AdminClients from "@/pages/admin/Clients";

// Vendor pages
import VendorMetrics from "@/pages/vendor/Metrics";
import VendorAnalysis from "@/pages/vendor/Analysis";
import VendorMarketplace from "@/pages/vendor/Marketplace";

// Client pages
import ClientSurveys from "@/pages/client/Surveys";
import ClientMetrics from "@/pages/client/Metrics";
import ClientAnalysis from "@/pages/client/Analysis";

// Auth provider
import { AuthProvider } from "@/hooks/useAuth";

function Router() {
  const [location] = useLocation();
  const { data: user } = useQuery({ 
    queryKey: ['/api/auth/me'],
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // If we're on a protected route and not authenticated, redirect to signin
  const isProtectedRoute = 
    location.startsWith('/admin') || 
    location.startsWith('/vendor') || 
    location.startsWith('/client');

  // Determine if user has pending approval
  const isPendingApproval = user && user.flag === 'no';

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/pending-approval" component={PendingApproval} />

      {/* Admin routes */}
      <Route path="/admin/surveys">
        {user && user.role === 'admin' ? <AdminSurveys /> : <Signin />}
      </Route>
      <Route path="/admin/vendors">
        {user && user.role === 'admin' ? <AdminVendors /> : <Signin />}
      </Route>
      <Route path="/admin/clients">
        {user && user.role === 'admin' ? <AdminClients /> : <Signin />}
      </Route>

      {/* Vendor routes */}
      <Route path="/vendor/metrics">
        {user && user.role === 'vendor' && user.flag === 'yes' ? <VendorMetrics /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>
      <Route path="/vendor/analysis">
        {user && user.role === 'vendor' && user.flag === 'yes' ? <VendorAnalysis /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>
      <Route path="/vendor/marketplace">
        {user && user.role === 'vendor' && user.flag === 'yes' ? <VendorMarketplace /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>

      {/* Client routes */}
      <Route path="/client/surveys">
        {user && user.role === 'client' && user.flag === 'yes' ? <ClientSurveys /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>
      <Route path="/client/metrics">
        {user && user.role === 'client' && user.flag === 'yes' ? <ClientMetrics /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>
      <Route path="/client/analysis">
        {user && user.role === 'client' && user.flag === 'yes' ? <ClientAnalysis /> : isPendingApproval ? <PendingApproval /> : <Signin />}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
