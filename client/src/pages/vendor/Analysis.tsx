import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { SurveyResponse } from '@/types';

export default function VendorAnalysis() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('performance');

  // Fetch vendor's completed survey responses
  const { data: surveyResponses, isLoading } = useQuery({
    queryKey: ['/api/survey-responses/vendor'],
    enabled: !!user,
  });

  return (
    <DashboardLayout title="Analysis Dashboard">
      <Tabs defaultValue="performance" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Performance Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold">92%</p>
                  <p className="mt-1 text-xs text-gray-500">+5% from last month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Quality Score</h4>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold">4.8/5</p>
                  <p className="mt-1 text-xs text-gray-500">+0.2 from last month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Average Response Time</h4>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold">2.3 hours</p>
                  <p className="mt-1 text-xs text-gray-500">-0.5 hours from last month</p>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="mt-8 h-72 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <BarChart2 className="h-12 w-12 mb-2" />
                  <p>Performance trend chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Performing Surveys */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Survey Item */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Food Quality Assessment</h4>
                    <p className="text-sm text-gray-500">Completed in 5.2 minutes (average)</p>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-800">Food & Beverage</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-500">Quality Score</p>
                  </div>
                </div>
                
                {/* Survey Item */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Dining Experience Survey</h4>
                    <p className="text-sm text-gray-500">Completed in 8.7 minutes (average)</p>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-800">Food & Beverage</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">95%</p>
                    <p className="text-sm text-gray-500">Quality Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Total Earnings</h4>
                  <p className="mt-2 text-2xl font-bold">$235.50</p>
                  <p className="mt-1 text-xs text-gray-500">This month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Average Earnings</h4>
                  <p className="mt-2 text-2xl font-bold">$5.85</p>
                  <p className="mt-1 text-xs text-gray-500">Per survey</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Potential Earnings</h4>
                  <p className="mt-2 text-2xl font-bold">$425.00</p>
                  <p className="mt-1 text-xs text-gray-500">Available surveys</p>
                </div>
              </div>
              
              {/* Earnings Chart */}
              <div className="h-72 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <TrendingUp className="h-12 w-12 mb-2" />
                  <p>Earnings trend chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category Distribution Chart */}
              <div className="h-72 relative bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center mb-8">
                <div className="text-gray-400 flex flex-col items-center">
                  <PieChart className="h-12 w-12 mb-2" />
                  <p>Category distribution chart would appear here</p>
                </div>
              </div>
              
              {/* Category List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Badge className="bg-green-100 text-green-800 px-2 py-1">Food & Beverage</Badge>
                  <div className="text-sm">
                    <span className="font-medium">42 surveys</span>
                    <span className="text-gray-500 ml-2">($210.00 earned)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Badge className="bg-blue-100 text-blue-800 px-2 py-1">Household</Badge>
                  <div className="text-sm">
                    <span className="font-medium">5 surveys</span>
                    <span className="text-gray-500 ml-2">($25.50 earned)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
