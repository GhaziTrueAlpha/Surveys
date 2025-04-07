import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/types';
import { formatDate, getCategoryColor } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SurveyCardProps {
  survey: Survey;
  type: 'marketplace' | 'completed';
  onTakeSurvey?: (surveyId: string) => void;
  reward?: string;
}

export default function SurveyCard({ survey, type, onTakeSurvey, reward }: SurveyCardProps) {
  const { id, title, description, category, reward_amount, estimated_time, created_at } = survey;
  const { user } = useAuth();
  
  const handleTakeSurvey = () => {
    if (onTakeSurvey) {
      onTakeSurvey(id);
    }
  };
  
  // Only admins should see category information
  const showCategory = user?.role === 'admin';
  
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {reward_amount && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              ${reward_amount} Reward
            </Badge>
          )}
          {reward && type === 'completed' && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              ${reward} Earned
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{formatDate(created_at)}</span>
        </div>
        {estimated_time && (
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            <span>Est. time: {estimated_time} minutes</span>
          </div>
        )}
        
        {/* Only show category information to admins */}
        {showCategory && (
          <div className="mt-2">
            <Badge className={`${getCategoryColor(category)}`}>
              {category}
            </Badge>
          </div>
        )}
      </CardContent>
      {type === 'marketplace' && (
        <CardFooter className="bg-gray-50 px-5 py-3">
          <Button 
            variant="link" 
            className="text-primary font-medium hover:text-indigo-500 flex items-center justify-center w-full"
            onClick={handleTakeSurvey}
          >
            Take Survey
            <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
