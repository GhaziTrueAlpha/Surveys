import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import { Survey } from '@/types';

export default function ClientAnalysis() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('demographics');

  // Fetch client's surveys
  const { data: surveys, isLoading } = useQuery({
    queryKey: ['/api/surveys'],
    enabled: !!user,
  });

  return (
    <DashboardLayout title="Analysis Dashboard">
      <Tabs defaultValue="demographics" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="responses">Response Analysis</TabsTrigger>
          <TabsTrigger value="timing">Timing & Completion</TabsTrigger>
        </TabsList>
        
        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Respondent Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Age Distribution Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Age Distribution</h4>
                  <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <BarChart2 className="h-12 w-12 mb-2" />
                      <p>Age distribution chart would appear here</p>
                    </div>
                  </div>
                </div>
                
                {/* Gender Distribution Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Gender Distribution</h4>
                  <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <PieChart className="h-12 w-12 mb-2" />
                      <p>Gender distribution chart would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Location Distribution Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Geographic Distribution</h4>
                  <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <BarChart2 className="h-12 w-12 mb-2" />
                      <p>Geographic distribution chart would appear here</p>
                    </div>
                  </div>
                </div>
                
                {/* Income Distribution Chart */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Income Distribution</h4>
                  <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <BarChart2 className="h-12 w-12 mb-2" />
                      <p>Income distribution chart would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Response Analysis Tab */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Response Rate Chart */}
              <div className="h-72 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center mb-8">
                <div className="text-gray-400 flex flex-col items-center">
                  <TrendingUp className="h-12 w-12 mb-2" />
                  <p>Response rate trend chart would appear here</p>
                </div>
              </div>
              
              {/* Key Insights */}
              <h4 className="text-base font-medium text-gray-700 mb-2">Key Insights</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Increasing engagement:</span> Response rates have increased by 8% over the last month.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Potential improvement:</span> Only 65% of respondents complete the entire survey. Consider shortening the survey length.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Question Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Question Analysis Item */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Q1: How satisfied are you with our product?</h4>
                  <div className="h-40 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <BarChart2 className="h-8 w-8 mb-2" />
                      <p>Response distribution chart would appear here</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Insight:</span> 78% of respondents rated their satisfaction as 4 or 5 on a 5-point scale.
                  </p>
                </div>
                
                {/* Question Analysis Item */}
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">Q2: How likely are you to recommend our product to others?</h4>
                  <div className="h-40 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 flex flex-col items-center">
                      <BarChart2 className="h-8 w-8 mb-2" />
                      <p>Response distribution chart would appear here</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Insight:</span> NPS score of 42, which is above industry average.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Timing & Completion Tab */}
        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Survey Completion Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Average Completion Time</h4>
                  <p className="mt-2 text-2xl font-bold">8.2 min</p>
                  <p className="mt-1 text-xs text-gray-500">Across all surveys</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                  <p className="mt-2 text-2xl font-bold">72%</p>
                  <p className="mt-1 text-xs text-green-500">+5% from last month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Drop-off Rate</h4>
                  <p className="mt-2 text-2xl font-bold">28%</p>
                  <p className="mt-1 text-xs text-red-500">-5% from last month</p>
                </div>
              </div>
              
              {/* Completion Time Chart */}
              <h4 className="text-base font-medium text-gray-700 mb-2">Completion Time by Survey</h4>
              <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <BarChart2 className="h-12 w-12 mb-2" />
                  <p>Completion time chart would appear here</p>
                </div>
              </div>
              
              {/* Drop-off Analysis */}
              <h4 className="text-base font-medium text-gray-700 mb-2 mt-8">Drop-off Analysis</h4>
              <div className="h-64 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <BarChart2 className="h-12 w-12 mb-2" />
                  <p>Drop-off analysis chart would appear here</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Key Finding:</span> Most drop-offs occur at question 7, which asks for detailed feedback. Consider making this question optional or simplifying it.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
