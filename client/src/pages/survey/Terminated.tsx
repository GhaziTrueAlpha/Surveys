import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function TerminationRedirect() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <Clock className="mx-auto h-12 w-12 text-orange-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Survey Terminated
          </h2>
          <div className="mt-6 text-gray-600">
            <p className="mb-4 font-medium text-red-600">
              Your survey session has been terminated because you took too long to complete it.
            </p>
            <p className="mb-8">
              The survey has a time limit that has been exceeded. Please try to complete future surveys within the allotted time.
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