import React from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function Signup() {
  const { user } = useAuth();
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
  
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkHref="/signin"
    >
      <SignupForm />
    </AuthLayout>
  );
}
