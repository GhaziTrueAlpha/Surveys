import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Survey, SurveyResponse } from '@/types';
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import SurveyCard from '@/components/surveys/SurveyCard';
import { getCategoryColor, formatDate } from '@/lib/utils';

export default function VendorMarketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Fetch available surveys for the vendor (filtered by category)
  const { 
    data: availableSurveys, 
    isLoading: isLoadingSurveys,
    error: surveysError
  } = useQuery<Survey[]>({
    queryKey: ['/api/surveys'],
    enabled: !!user,
  });

  // Fetch vendor's completed survey responses
  const {
    data: completedResponses,
    isLoading: isLoadingResponses,
    error: responsesError
  } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses/vendor'],
    enabled: !!user,
  });

  // Process completed surveys
  const completedSurveyIds = completedResponses ? 
    completedResponses.map((response: SurveyResponse) => response.survey_id) : [];

  // Filter available surveys (not completed yet and matching search term)
  const filteredSurveys = availableSurveys ? 
    availableSurveys
      .filter((survey: Survey) => !completedSurveyIds.includes(survey.id) && survey.is_active)
      .filter((survey: Survey) => {
        if (!searchTerm) return true;
        return (
          survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (survey.description && survey.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }) : [];

  // Sort available surveys
  const sortedSurveys = [...(filteredSurveys || [])].sort((a: Survey, b: Survey) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'payout-high':
        const aReward = parseFloat(a.reward_amount || '0');
        const bReward = parseFloat(b.reward_amount || '0');
        return bReward - aReward;
      case 'payout-low':
        const aRewardLow = parseFloat(a.reward_amount || '0');
        const bRewardLow = parseFloat(b.reward_amount || '0');
        return aRewardLow - bRewardLow;
      default:
        return 0;
    }
  });

  const handleTakeSurvey = async (surveyId: string) => {
    try {
      // In a real application, this would redirect to the actual survey
      // For now, we'll just create a survey response
      await apiRequest('POST', '/api/survey-responses', {
        survey_id: surveyId,
        reward_earned: availableSurveys.find((s: Survey) => s.id === surveyId)?.reward_amount
      });
      
      // Refetch survey responses
      queryClient.invalidateQueries({ queryKey: ['/api/survey-responses/vendor'] });
      
      toast({
        title: 'Success!',
        description: 'Survey completed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete survey',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout 
      title="Survey Marketplace"
      description={
        user?.category ? 
        <div className="text-sm text-gray-600 flex items-center mt-1">
          <span className="font-semibold">Your Category:</span>
          <Badge className={`ml-2 ${getCategoryColor(user.category)}`}>
            {user.category}
          </Badge>
        </div> : undefined
      }
    >
      {/* Survey Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 flex space-x-2">
            <div className="max-w-xs">
              <label htmlFor="sort-surveys" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <Select 
                defaultValue="newest"
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger id="sort-surveys" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="payout-high">Highest Payout</SelectItem>
                  <SelectItem value="payout-low">Lowest Payout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-w-xs flex-grow">
              <label htmlFor="search-marketplace" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="search-marketplace"
                  type="text"
                  placeholder="Search surveys..."
                  className="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Surveys */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Surveys</h2>
      {isLoadingSurveys ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : surveysError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load surveys. Please try again later.
          </AlertDescription>
        </Alert>
      ) : sortedSurveys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No surveys available</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              There are no available surveys matching your category at this time. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSurveys.map((survey: Survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              type="marketplace"
              onTakeSurvey={handleTakeSurvey}
            />
          ))}
        </div>
      )}
      
      {/* Completed Surveys */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Completed Surveys</h2>
      {isLoadingResponses ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : responsesError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load completed surveys. Please try again later.
          </AlertDescription>
        </Alert>
      ) : !completedResponses || completedResponses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No completed surveys</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              You haven't completed any surveys yet. Start by taking a survey from the available options above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {completedResponses.map((response: SurveyResponse) => {
              const survey = availableSurveys?.find((s: Survey) => s.id === response.survey_id);
              return (
                <li key={response.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {survey?.title || 'Survey'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Completed on {formatDate(response.completed_at)}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Badge className="bg-green-100 text-green-800">
                        ${response.reward_earned || '0.00'} Earned
                      </Badge>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
}
