import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { UserSignupData } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  role: z.enum(['vendor', 'client']),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string(),
  company_name: z.string().min(1, "Company name is required"),
  account_email: z.string().email("Invalid account email"),
  gst: z.string().min(1, "GST is required"),
  city: z.string().min(1, "City is required"),
  website: z.string().optional(),
  contact_number: z.string().optional(),
  hsn_sac: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
});

export default function SignupForm() {
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const [_, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'client',
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      company_name: '',
      account_email: '',
      gst: '',
      city: '',
      website: '',
      contact_number: '',
      hsn_sac: '',
      country: '',
      region: '',
      terms: false
    }
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Extract the data we want to send to the API
      const { confirm_password, terms, ...userData } = values;
      
      await signup(userData as UserSignupData);
      
      // Redirect to pending approval page
      navigate('/pending-approval');
      
      toast({
        title: 'Success!',
        description: 'Your account has been created and is pending approval.',
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Role Selection */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="block text-sm font-medium text-gray-700 mb-2">I want to:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className={`relative border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${field.value === 'client' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}`}>
                    <div className="flex items-start">
                      <RadioGroupItem value="client" id="client" className="h-4 w-4 text-primary focus:ring-indigo-500 border-gray-300" />
                      <div className="ml-3 text-sm">
                        <label htmlFor="client" className="font-medium text-gray-700">Create Surveys</label>
                        <p className="text-gray-500">I need to collect data and insights through surveys</p>
                      </div>
                    </div>
                  </div>
                  <div className={`relative border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${field.value === 'vendor' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}`}>
                    <div className="flex items-start">
                      <RadioGroupItem value="vendor" id="vendor" className="h-4 w-4 text-primary focus:ring-indigo-500 border-gray-300" />
                      <div className="ml-3 text-sm">
                        <label htmlFor="vendor" className="font-medium text-gray-700">Take Surveys</label>
                        <p className="text-gray-500">I want to participate in surveys and provide feedback</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Name *</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="account_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Account Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Company Name *</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gst"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">GST *</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">City *</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Fields Toggle */}
        <div className="mt-6">
          <div className="flex items-center">
            <button
              type="button"
              className="text-primary font-medium focus:outline-none"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
            >
              {showOptionalFields ? 'Hide' : 'Show'} optional fields
            </button>
          </div>
        </div>

        {/* Optional Fields */}
        {showOptionalFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">Website</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">Contact Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hsn_sac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">HSN SAC</FormLabel>
                  <FormControl>
                    <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">Country</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select a country</SelectItem>
                        <SelectItem value="IN">India</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">Region</FormLabel>
                  <FormControl>
                    <Input {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Password *</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Confirm Password *</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Terms Checkbox */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex items-start">
              <FormControl>
                <div className="flex items-center h-5">
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-4 w-4 text-primary focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </FormControl>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-primary hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-primary hover:text-indigo-800">Privacy Policy</a>
                </label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}
