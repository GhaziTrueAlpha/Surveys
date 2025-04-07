import { createClient } from '@supabase/supabase-js';

// Define a mock Supabase client
class MockSupabaseClient {
  auth = {
    signUp: () => Promise.resolve({ data: null, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  };
}

// Try to create client if environment variables are defined
let supabase;
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Use a mock client if credentials are missing
    console.log('Using mock Supabase client - actual auth handled by Express API');
    supabase = new MockSupabaseClient();
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Use a mock client in case of errors
  supabase = new MockSupabaseClient();
}

// Export the client (real or mock)
export { supabase };

// We'll use this class for when we integrate with real Supabase
// For now, we'll use our Express backend
export class SupabaseService {
  async signUp(email: string, password: string, userData: any) {
    // This would be replaced with real Supabase auth
    /*
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
    */
    
    // Use our Express API instead
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
  }
  
  async signIn(email: string, password: string) {
    // This would be replaced with real Supabase auth
    /*
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
    */
    
    // Use our Express API instead
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
  }
  
  async signOut() {
    // This would be replaced with real Supabase auth
    /*
    const { error } = await supabase.auth.signOut();
    return { error };
    */
    
    // Use our Express API instead
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error signing out');
    }
    
    return await response.json();
  }
  
  async getUser() {
    // This would be replaced with real Supabase auth
    /*
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
    */
    
    // Use our Express API instead
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
  }
}

export const supabaseService = new SupabaseService();
