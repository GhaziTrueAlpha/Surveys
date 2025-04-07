import React from 'react';
import { Survey } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getCategoryColor } from '@/lib/utils';

interface SurveyListProps {
  role: 'admin' | 'client';
  onEdit?: (survey: Survey) => void;
  onDelete?: (surveyId: string) => void;
  onView?: (surveyId: string) => void;
}

export default function SurveyList({ role, onEdit, onDelete, onView }: SurveyListProps) {
  const { toast } = useToast();
  
  const { data: surveys, isLoading, error } = useQuery<Survey[]>({
    queryKey: ['/api/surveys'],
  });
  
  const handleDelete = async (surveyId: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) {
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/surveys/${surveyId}`);
      
      toast({
        title: 'Success!',
        description: 'Survey deleted successfully.',
      });
    } catch (error) {
      console.error('Survey deletion error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete survey',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load surveys. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!surveys || surveys.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No surveys available</h3>
        <p className="mt-1 text-sm text-gray-500">
          {role === 'admin' 
            ? 'No surveys have been created yet.'
            : 'You haven\'t created any surveys yet.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {surveys.map((survey: Survey) => (
          <li key={survey.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1 px-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{survey.title}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{survey.category}</span>
                        <Badge className={`ml-1 ${survey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {survey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 line-clamp-2">{survey.description}</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Created: {formatDate(survey.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(survey)}
                    >
                      Edit
                    </Button>
                  )}
                  {onView && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onView(survey.id)}
                    >
                      View
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(survey.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
