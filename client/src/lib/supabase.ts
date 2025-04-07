import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with provided credentials
const supabaseUrl = 'https://iydnallkfyclqdefphxc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcXB1bXJzdGxmamZlb3ljdGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Njg0MjYsImV4cCI6MjA1ODI0NDQyNn0.kaP-AfDwgkWQDcemvwzRjrx9ksrL2aJKgjx1jBruNA4';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the client
export { supabase };

// Use Supabase for authentication and our Express backend for app data
export class SupabaseService {
  async signUp(email: string, password: string, userData: any) {
    try {
      // First, create a user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // Store additional user data in Supabase
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error.message);
        throw new Error(error.message);
      }
      
      // Then register in our application database
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error signing up');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }
  
  async signIn(email: string, password: string) {
    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase signin error:', error.message);
        throw new Error(error.message);
      }
      
      // Then authenticate with our application
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error signing in');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }
  
  async signOut() {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signout error:', error.message);
      }
      
      // Sign out from our application
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error signing out');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  }
  
  async getUser() {
    try {
      // Try to get user from Supabase first
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Supabase getUser error:', error.message);
      }
      
      // Then get user details from our application
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return { user: null };
        }
        const error = await response.json();
        throw new Error(error.message || 'Error getting user');
      }
      
      const user = await response.json();
      return { user };
    } catch (error) {
      console.error('GetUser error:', error);
      if (error instanceof Response && error.status === 401) {
        return { user: null };
      }
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
