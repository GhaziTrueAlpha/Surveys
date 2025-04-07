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
            <p className="mb-4 font-bold text-red-600">
              Don't play dumb buddy you're trying to do something sneaky. We caught you!
            </p>
            <p className="mb-8">
              This security violation has been logged. Please return to the marketplace for surveys you're eligible to take.
            </p>
            <Button
              onClick={() => setLocation('/vendor/marketplace')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Return to Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}