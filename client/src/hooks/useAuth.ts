import React, { createContext, useContext, useEffect, useState } from "react";
import { supabaseService } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSigninData, UserSignupData, User, AuthContextType } from "@/types";
import { useLocation } from "wouter";

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signin: async () => {},
  signup: async () => {},
  signout: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [_, navigate] = useLocation();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  // Sign in function
  const signin = async (data: UserSigninData) => {
    try {
      const user = await supabaseService.signIn(data.email, data.password);
      
      // Refresh user data
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Check if there's a pending survey verification
      const pendingSurveyId = sessionStorage.getItem('pendingSurveyVerification');
      
      // Handle redirects based on user role and approval status
      if (user) {
        if (user.flag === 'no') {
          navigate('/pending-approval');
        } else if (pendingSurveyId && user.role === 'vendor') {
          // Clear the stored survey ID
          sessionStorage.removeItem('pendingSurveyVerification');
          // Redirect to the verification page
          navigate(`/survey/verify/${pendingSurveyId}`);
        } else {
          switch (user.role) {
            case 'admin':
              navigate('/admin/surveys');
              break;
            case 'vendor':
              navigate('/vendor/metrics');
              break;
            case 'client':
              navigate('/client/surveys');
              break;
          }
        }
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign up function
  const signup = async (data: UserSignupData) => {
    try {
      const result = await supabaseService.signUp(data.email, data.password, data);
      
      // Navigate to pending approval page
      navigate('/pending-approval');
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const signout = async () => {
    try {
      await supabaseService.signOut();
      
      // Clear user from query cache
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const contextValue = {
    user: user as User | null,
    isLoading,
    signin,
    signup,
    signout
  };

  // Use createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

// Auth hook
export function useAuth() {
  return useContext(AuthContext);
}