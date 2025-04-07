import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getCategoryColor(category: string): string {
  const categoryColorMap: Record<string, string> = {
    'Automobile': 'bg-blue-100 text-blue-800',
    'Food & Beverage': 'bg-green-100 text-green-800',
    'Ethnicity': 'bg-purple-100 text-purple-800',
    'Business & Occupation': 'bg-yellow-100 text-yellow-800',
    'Healthcare Consumer': 'bg-red-100 text-red-800',
    'Healthcare Professional': 'bg-indigo-100 text-indigo-800',
    'Mobile': 'bg-teal-100 text-teal-800',
    'Smoking': 'bg-orange-100 text-orange-800',
    'Household': 'bg-pink-100 text-pink-800',
    'Education': 'bg-cyan-100 text-cyan-800',
    'Electronic': 'bg-lime-100 text-lime-800',
    'Gaming': 'bg-violet-100 text-violet-800',
    'Mother & Baby': 'bg-rose-100 text-rose-800',
    'Media': 'bg-emerald-100 text-emerald-800',
    'Travel': 'bg-sky-100 text-sky-800',
    'Hobbies & Interests': 'bg-amber-100 text-amber-800',
  };
  
  return categoryColorMap[category] || 'bg-gray-100 text-gray-800';
}
