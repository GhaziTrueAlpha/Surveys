import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Loader2, Clock } from 'lucide-react';

export default function PendingApproval() {
  const { user, isLoading, signout } = useAuth();
  const [_, navigate] = useLocation();
  
  // If user is approved, redirect to appropriate dashboard
  React.useEffect(() => {
    if (user && user.flag === 'yes') {
      if (user.role === 'admin') {
        navigate('/admin/surveys');
      } else if (user.role === 'vendor') {
        navigate('/vendor/metrics');
      } else if (user.role === 'client') {
        navigate('/client/surveys');
      }
    } else if (!user && !isLoading) {
      // If not logged in, redirect to signin
      navigate('/signin');
    }
  }, [user, isLoading, navigate]);
  
  const handleSignOut = async () => {
    await signout();
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <div className="rounded-full bg-yellow-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
        <p className="text-gray-600 mb-6">
          Your account is currently pending administrator approval. You'll receive an email notification once your account has been approved.
        </p>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
