import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export default function SigninForm() {
  const { toast } = useToast();
  const { signin } = useAuth();
  const [_, navigate] = useLocation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    }
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { email, password } = values;
      
      await signin({ email, password });
      
      // Auth hook will handle redirects
      toast({
        title: 'Success!',
        description: 'You are now signed in.',
      });
    } catch (error) {
      console.error('Signin error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email address</FormLabel>
                <FormControl>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <div className="flex items-center h-5">
                    <Checkbox
                      id="remember-me"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 text-primary focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </FormControl>
                <div className="ml-2">
                  <label htmlFor="remember-me" className="text-sm text-gray-900">Remember me</label>
                </div>
              </FormItem>
            )}
          />

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}
