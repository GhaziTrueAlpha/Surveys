// Use our Express backend for authentication
export class SupabaseService {
  async signUp(email: string, password: string, userData: any) {
    try {
      // Register in our application database
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
      // Authenticate with our application
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
      // Get user details from our application
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
