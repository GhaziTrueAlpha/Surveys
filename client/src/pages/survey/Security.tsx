import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function SecurityRedirect() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Survey Security Alert
          </h2>
          <div className="mt-6 text-gray-600">
            <p className="mb-4">
              Your survey session has been flagged for security reasons. 
              This may be due to suspicious activity or invalid responses.
            </p>
            <p className="mb-8">
              If you believe this is a mistake, please contact the survey administrator.
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="w-full"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}