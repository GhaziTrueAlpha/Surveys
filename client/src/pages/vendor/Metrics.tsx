import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { FileText, MousePointer, BarChart2, Clock } from 'lucide-react';
import { SurveyResponse } from '@/types';

export default function VendorMetrics() {
  const { user } = useAuth();

  // Fetch vendor's completed survey responses
  const { data: surveyResponses, isLoading } = useQuery({
    queryKey: ['/api/survey-responses/vendor'],
    enabled: !!user,
  });

  // Calculate metrics from survey responses
  const totalSurveysCompleted = surveyResponses?.length || 0;
  
  // In a real app, these metrics would be calculated from actual data
  // For now we'll use placeholder calculations
  const dailyClicks = 128;
  const conversionRate = '24.3%';
  const averageCompletionTime = '7.2 min';

  return (
    <DashboardLayout title="Metrics Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Survey Metrics */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Surveys Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalSurveysCompleted}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Clicks */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Daily Clicks</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{dailyClicks}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      8%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{conversionRate}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Decreased by</span>
                      2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Completion Time */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Completion Time</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{averageCompletionTime}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Improved by</span>
                      5%
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
        {/* Line Chart for Survey Completions */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Survey Completions Over Time</h3>
            <div className="mt-2 h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <BarChart2 className="h-12 w-12 mb-2" />
                <p>Survey completions chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bar Chart for Categories */}
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Survey Performance by Category</h3>
            <div className="mt-2 h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <BarChart2 className="h-12 w-12 mb-2" />
                <p>Category performance chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
