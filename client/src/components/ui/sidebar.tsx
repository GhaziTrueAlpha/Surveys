import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  FileText, 
  Users, 
  BarChart2, 
  BarChart, 
  ShoppingCart,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { User as UserType } from '@/types';

interface SidebarProps {
  user: UserType;
}

export function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  const { signout } = useAuth();
  
  const handleSignOut = async () => {
    await signout();
  };
  
  const getLinkClass = (path: string) => {
    return cn(
      "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md",
      {
        "bg-gray-100 text-gray-900": location.startsWith(path)
      }
    );
  };
  
  return (
    <div className="md:flex md:flex-shrink-0">
      <div className="fixed inset-y-0 left-0 flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-primary font-semibold text-xl">SurveyMarket</span>
            </div>
            <div className="mt-5 flex-1 px-2 space-y-1">
              {/* Admin Navigation */}
              {user.role === 'admin' && (
                <div className="space-y-1">
                  <Link href="/admin/surveys">
                    <a className={getLinkClass('/admin/surveys')}>
                      <FileText className="text-gray-500 mr-3 h-6 w-6" />
                      Surveys
                    </a>
                  </Link>
                  <Link href="/admin/vendors">
                    <a className={getLinkClass('/admin/vendors')}>
                      <Users className="text-gray-500 mr-3 h-6 w-6" />
                      Vendors
                    </a>
                  </Link>
                  <Link href="/admin/clients">
                    <a className={getLinkClass('/admin/clients')}>
                      <User className="text-gray-500 mr-3 h-6 w-6" />
                      Clients
                    </a>
                  </Link>
                </div>
              )}

              {/* Vendor Navigation */}
              {user.role === 'vendor' && (
                <div className="space-y-1">
                  <Link href="/vendor/metrics">
                    <a className={getLinkClass('/vendor/metrics')}>
                      <BarChart2 className="text-gray-500 mr-3 h-6 w-6" />
                      Metrics
                    </a>
                  </Link>
                  <Link href="/vendor/analysis">
                    <a className={getLinkClass('/vendor/analysis')}>
                      <BarChart className="text-gray-500 mr-3 h-6 w-6" />
                      Analysis
                    </a>
                  </Link>
                  <Link href="/vendor/marketplace">
                    <a className={getLinkClass('/vendor/marketplace')}>
                      <ShoppingCart className="text-gray-500 mr-3 h-6 w-6" />
                      Marketplace
                    </a>
                  </Link>
                </div>
              )}

              {/* Client Navigation */}
              {user.role === 'client' && (
                <div className="space-y-1">
                  <Link href="/client/surveys">
                    <a className={getLinkClass('/client/surveys')}>
                      <FileText className="text-gray-500 mr-3 h-6 w-6" />
                      Surveys
                    </a>
                  </Link>
                  <Link href="/client/metrics">
                    <a className={getLinkClass('/client/metrics')}>
                      <BarChart2 className="text-gray-500 mr-3 h-6 w-6" />
                      Metrics
                    </a>
                  </Link>
                  <Link href="/client/analysis">
                    <a className={getLinkClass('/client/analysis')}>
                      <BarChart className="text-gray-500 mr-3 h-6 w-6" />
                      Analysis
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="inline-block h-9 w-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                    {user.role}
                    {user.category && ` - ${user.category}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <button 
                onClick={handleSignOut}
                className="text-gray-400 hover:text-gray-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
