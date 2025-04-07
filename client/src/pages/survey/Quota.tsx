import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function QuotaRedirect() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Survey Quota Reached
          </h2>
          <div className="mt-6 text-gray-600">
            <p className="mb-4">
              The quota for this survey has been reached. 
              We have already collected enough responses from participants with your profile.
            </p>
            <p className="mb-8">
              Thank you for your interest. Please check back for other available surveys.
            </p>
            <Button
              onClick={() => setLocation('/vendor/marketplace')}
              className="w-full"
            >
              Browse Available Surveys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}