import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  description,
  actionButton
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will be redirected by Router in App.tsx
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar user={user} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden ml-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            {actionButton}
          </div>
        </header>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
