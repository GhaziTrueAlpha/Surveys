import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { Survey } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function VerifySurvey() {
  const { surveyId } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!surveyId) {
          setError('Invalid survey ID');
          setIsLoading(false);
          return;
        }
        
        // Fetch the survey by its unique ID
        const response = await apiRequest('GET', `/api/surveys/unique/${surveyId}`);
        if (!response) {
          setError('Survey not found');
          setIsLoading(false);
          return;
        }
        
        const surveyData = response as unknown as Survey;
        setSurvey(surveyData);
        
        // Verification criteria:
        // 1. User must be logged in
        // 2. User must be a vendor
        // 3. Vendor category must match the survey category
        // 4. Survey must be active
        
        if (!user) {
          // Not logged in, save the survey ID in session storage and redirect to login
          sessionStorage.setItem('pendingSurveyVerification', surveyId);
          navigate('/signin');
          return;
        }
        
        if (user.role !== 'vendor') {
          setError('Only vendors can take surveys');
          setIsLoading(false);
          return;
        }
        
        if (user.category !== surveyData.category) {
          navigate('/survey/security');
          return;
        }
        
        if (!surveyData.is_active) {
          setError('This survey is no longer active');
          setIsLoading(false);
          return;
        }
        
        // All checks passed, redirect to the actual survey
        if (surveyData.survey_link) {
          window.location.href = surveyData.survey_link;
        } else {
          setError('Survey link is missing');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Failed to verify survey eligibility');
        setIsLoading(false);
        console.error('Survey verification error:', err);
      }
    };
    
    verifyAndRedirect();
  }, [surveyId, user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Verifying...</h2>
          <p className="text-gray-600">Please wait while we verify your eligibility for this survey.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return null; // This should never render as we're either showing loading, error, or redirecting
}