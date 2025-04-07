import React from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { SurveyResponse } from '@/types';

export default function CompletionRedirect() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [rewardEarned, setRewardEarned] = React.useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!params.surveyId || !user) {
        throw new Error("Missing survey ID or user data");
      }
      
      const response = await apiRequest('POST', `/api/survey-responses`, {
        survey_id: params.surveyId,
        vendor_id: user.id
      });
      
      return response;
    },
    onSuccess: (data: any) => {
      setRewardEarned(data?.reward_earned || 'Not specified');
      toast({
        title: 'Survey Completed',
        description: 'Your response has been recorded successfully.'
      });
    },
    onError: (error) => {
      console.error('Error recording survey completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to record your survey completion.',
        variant: 'destructive'
      });
    }
  });

  // Trigger the mutation when component mounts
  React.useEffect(() => {
    if (params.surveyId && user) {
      mutate();
    }
  }, [mutate, params.surveyId, user]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-4 text-gray-600">Recording your response...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Survey Completed
          </h2>
          <div className="mt-6 text-gray-600">
            <p className="mb-4 font-medium text-green-600">
              Thank you for completing the survey! Your rewards will be updated soon.
            </p>
            {rewardEarned && (
              <p className="mb-4 font-medium">
                Reward earned: ${rewardEarned}
              </p>
            )}
            <p className="mb-8">
              Your contribution is highly valued. You can now check out other available surveys in the marketplace.
            </p>
            <Button
              onClick={() => setLocation('/vendor/marketplace')}
              className="w-full"
            >
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}