import React from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import SigninForm from '@/components/auth/SigninForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function Signin() {
  const { user, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.flag === 'no') {
        navigate('/pending-approval');
        return;
      }
      
      if (user.role === 'admin') {
        navigate('/admin/surveys');
      } else if (user.role === 'vendor') {
        navigate('/vendor/metrics');
      } else if (user.role === 'client') {
        navigate('/client/surveys');
      }
    }
  }, [user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkHref="/signup"
    >
      <SigninForm />
    </AuthLayout>
  );
}
