import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SURVEY_CATEGORIES, SurveyCategory, User } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface SurveyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(SURVEY_CATEGORIES as unknown as [string, ...string[]]),
  client_id: z.string().min(1, "Client selection is required"),
  reward_amount: z.string().optional(),
  estimated_time: z.string().optional(),
  loi: z.string().optional(),
  sample_size: z.string().optional(),
  ir: z.string().optional(),
  market: z.string().optional(),
  target_audience: z.string().optional(),
  project_type: z.string().optional(),
  cpi: z.string().optional(),
  client_currency: z.string().optional(),
  survey_link: z.string().url("Survey link must be a valid URL"),
  security_redirect: z.string().url("Security redirect must be a valid URL").optional(),
  quota_redirect: z.string().url("Quota redirect must be a valid URL").optional(),
  completion_redirect: z.string().url("Completion redirect must be a valid URL").optional(),
  termination_redirect: z.string().url("Termination redirect must be a valid URL").optional(),
});

const currencies = [
  "USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "JPY", "CNY"
];

export default function SurveyForm({ isOpen, onClose, onSuccess }: SurveyFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/users?role=client&flag=yes');
      // Ensure we always return an array
      if (Array.isArray(response)) {
        return response as User[];
      } else {
        console.error("Expected users API to return an array but got:", response);
        return [] as User[];
      }
    }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Food & Beverage' as SurveyCategory,
      client_id: '',
      reward_amount: '',
      estimated_time: '',
      loi: '',
      sample_size: '',
      ir: '',
      market: '',
      target_audience: '',
      project_type: '',
      cpi: '',
      client_currency: 'USD',
      survey_link: '',
      security_redirect: '',
      quota_redirect: '',
      completion_redirect: '',
      termination_redirect: '',
    }
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiRequest('POST', '/api/surveys', values);
      
      onSuccess();
      onClose();
      
      toast({
        title: 'Success!',
        description: 'Survey created successfully.',
      });
    } catch (error) {
      console.error('Survey creation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create survey',
        variant: 'destructive'
      });
    }
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Survey</DialogTitle>
          <DialogDescription>
            Create a new survey to distribute to vendors in the selected category.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Survey Details</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="redirects">Redirects</TabsTrigger>
              </TabsList>
              
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Provide a description of your survey"
                          className="resize-none"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SURVEY_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients?.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.company_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Survey Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target_audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Males 25-45" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="project_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Market Research" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="market"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market/Geography</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. United States" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reward_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Amount</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} placeholder="e.g. 5.00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Metrics Tab */}
              <TabsContent value="metrics" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LOI (Length of Interview)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 15 minutes" />
                        </FormControl>
                        <FormDescription>
                          Average time to complete the survey
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="estimated_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Time (minutes)</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} placeholder="e.g. 10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sample_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample Size/People Size</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IR (Incidence Rate)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 50%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cpi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPI/Budget</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 4.50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="client_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Redirects Tab */}
              <TabsContent value="redirects" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="survey_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Survey Link *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/survey" />
                      </FormControl>
                      <FormDescription>
                        The primary URL where vendors will be directed to take the survey
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="security_redirect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Redirect URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/security-redirect" />
                      </FormControl>
                      <FormDescription>
                        URL for security validation failures
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quota_redirect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quota Full Redirect URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/quota-redirect" />
                      </FormControl>
                      <FormDescription>
                        URL when survey quotas are filled
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="completion_redirect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Redirect URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/completion-redirect" />
                      </FormControl>
                      <FormDescription>
                        URL for successful survey completions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termination_redirect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Redirect URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/termination-redirect" />
                      </FormControl>
                      <FormDescription>
                        URL for survey terminations (participant disqualified)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Survey</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
