import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import SurveyList from '@/components/surveys/SurveyList';
import SurveyForm from '@/components/surveys/SurveyForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Survey, SURVEY_CATEGORIES } from '@/types';
import { Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminSurveys() {
  const [isSurveyFormOpen, setIsSurveyFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const handleCreateSurvey = () => {
    setIsSurveyFormOpen(true);
  };
  
  const handleSurveyFormClose = () => {
    setIsSurveyFormOpen(false);
  };
  
  const handleSurveyFormSuccess = () => {
    // Refetch surveys after a new one is created
    queryClient.invalidateQueries({ queryKey: ['/api/surveys'] });
  };
  
  const handleEditSurvey = (survey: Survey) => {
    console.log('Edit survey:', survey);
    // In a real app, you would open a form with the survey details for editing
  };
  
  const handleViewSurvey = (surveyId: string) => {
    console.log('View survey:', surveyId);
    // In a real app, you would navigate to a survey details page
  };
  
  return (
    <DashboardLayout
      title="Surveys"
      actionButton={
        <Button onClick={handleCreateSurvey}>Create Survey</Button>
      }
    >
      {/* Survey Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 flex space-x-2">
            <div className="max-w-xs">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select 
                onValueChange={setSelectedCategory}
                defaultValue={selectedCategory}
              >
                <SelectTrigger id="category-filter" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SURVEY_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="max-w-xs flex-grow">
              <label htmlFor="search-surveys" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="search-surveys"
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

      {/* Surveys List */}
      <SurveyList 
        role="admin"
        onEdit={handleEditSurvey}
        onView={handleViewSurvey}
        onDelete={(id) => {
          // This is handled inside the component
          // Here we could add additional logic if needed
        }}
        searchTerm={searchTerm}
        categoryFilter={selectedCategory}
      />
      
      {/* Survey Form Dialog */}
      <SurveyForm 
        isOpen={isSurveyFormOpen}
        onClose={handleSurveyFormClose}
        onSuccess={handleSurveyFormSuccess}
      />
    </DashboardLayout>
  );
}
