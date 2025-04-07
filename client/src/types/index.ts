// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'vendor' | 'client';
  flag: 'yes' | 'no';
  category?: string;
  name: string;
  website?: string;
  company_name: string;
  account_email: string;
  contact_number?: string;
  hsn_sac?: string;
  gst: string;
  country?: string;
  region?: string;
  city: string;
  created_at: string;
}

export interface UserSignupData {
  name: string;
  email: string;
  password: string;
  role: 'vendor' | 'client';
  company_name: string;
  account_email: string;
  gst: string;
  city: string;
  website?: string;
  contact_number?: string;
  hsn_sac?: string;
  country?: string;
  region?: string;
}

export interface UserSigninData {
  email: string;
  password: string;
}

// Survey types
export interface Survey {
  id: string;
  title: string;
  description?: string;
  category: SurveyCategory;
  reward_amount?: string;
  estimated_time?: string;
  created_by: string;
  created_at: string;
  is_active: boolean;
}

export interface SurveyFormData {
  title: string;
  description?: string;
  category: SurveyCategory;
  reward_amount?: string;
  estimated_time?: string;
}

// Survey response types
export interface SurveyResponse {
  id: string;
  survey_id: string;
  vendor_id: string;
  completed_at: string;
  reward_earned?: string;
}

// Enum types
export type SurveyCategory = 
  | 'Automobile'
  | 'Food & Beverage'
  | 'Ethnicity' 
  | 'Business & Occupation'
  | 'Healthcare Consumer'
  | 'Healthcare Professional'
  | 'Mobile'
  | 'Smoking'
  | 'Household'
  | 'Education'
  | 'Electronic'
  | 'Gaming'
  | 'Mother & Baby'
  | 'Media'
  | 'Travel'
  | 'Hobbies & Interests';

export const SURVEY_CATEGORIES: SurveyCategory[] = [
  'Automobile',
  'Food & Beverage',
  'Ethnicity',
  'Business & Occupation',
  'Healthcare Consumer',
  'Healthcare Professional',
  'Mobile',
  'Smoking',
  'Household',
  'Education',
  'Electronic',
  'Gaming',
  'Mother & Baby',
  'Media',
  'Travel',
  'Hobbies & Interests'
];

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (data: UserSigninData) => Promise<void>;
  signup: (data: UserSignupData) => Promise<void>;
  signout: () => Promise<void>;
}
