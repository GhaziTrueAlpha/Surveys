import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Survey } from '@/types';
import { BarChart2, UsersIcon, TrendingUp, Clock } from 'lucide-react';

export default function ClientMetrics() {
  const { user } = useAuth();

  // Fetch client's surveys
  const { data: surveys, isLoading } = useQuery({
    queryKey: ['/api/surveys'],
    enabled: !!user,
  });

  // Calculate metrics from surveys
  const totalSurveys = surveys?.length || 0;
  const activeSurveys = surveys?.filter((survey: Survey) => survey.is_active).length || 0;
  
  // In a real app, these metrics would be calculated from actual data
  // For now we'll use placeholder calculations
  const totalResponses = 238;
  const avgResponseTime = '5.4 hours';

  return (
    <DashboardLayout title="Metrics Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Surveys */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Surveys</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalSurveys}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      3
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Surveys */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Surveys</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activeSurveys}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      2
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Responses */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalResponses}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      18%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Response Time</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{avgResponseTime}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      1.2h
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Responses Over Time Chart */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Responses Over Time</h3>
            <div className="mt-2 h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <BarChart2 className="h-12 w-12 mb-2" />
                <p>Response trend chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Survey Performance Chart */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Survey Performance</h3>
            <div className="mt-2 h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <BarChart2 className="h-12 w-12 mb-2" />
                <p>Survey performance chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Performing Surveys */}
      <div className="mt-8">
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Performing Surveys</h3>
            
            <div className="space-y-4">
              {/* Survey Performance Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Customer Satisfaction Survey</h4>
                  <div className="mt-1">
                    <Badge className="bg-green-100 text-green-800">Food & Beverage</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">92%</p>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                </div>
              </div>
              
              {/* Survey Performance Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Product Feedback Survey</h4>
                  <div className="mt-1">
                    <Badge className="bg-blue-100 text-blue-800">Food & Beverage</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
