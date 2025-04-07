import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Determine where to navigate based on user role
  const getHomeRoute = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "vendor":
        return "/vendor/marketplace";
      case "client":
        return "/client/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md mx-4 border-none shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">404 - Page Not Found</h1>
            <p className="text-base text-gray-600 max-w-sm mx-auto">
              The page you're looking for doesn't exist or may have been moved to a new location.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              className="w-full py-6 text-base" 
              onClick={() => navigate(getHomeRoute())}
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-6 text-base" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
