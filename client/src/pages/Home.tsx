import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (user) {
      if (user.flag === 'no') {
        navigate('/pending-approval');
        return;
      }
      
      if (user.role === 'admin') {
        navigate('/admin/surveys');
      } else if (user.role === 'vendor') {
        navigate('/vendor/metrics');
      } else if (user.role === 'client') {
        navigate('/client/surveys');
      }
    }
  }, [user, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary font-semibold text-xl">SurveyMarket</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <a className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Sign In</a>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">The Survey Marketplace</h1>
              <p className="text-lg text-gray-600 mb-6">Connect clients who need insights with the perfect vendors to provide data. Our platform makes survey distribution and collection efficient and targeted.</p>
              <div className="flex space-x-4">
                <Link href="/signup">
                  <Button onClick={() => navigate('/signup')} className="bg-primary text-white px-6 py-3 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create Surveys
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="bg-white text-primary border border-primary px-6 py-3 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Take Surveys
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg shadow-lg w-full aspect-video bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to get valuable survey data</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Clients */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Surveys</h3>
              <p className="text-gray-600">Design your survey with our easy-to-use tools and specify your target audience.</p>
            </div>
            {/* For Vendors */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Match with Vendors</h3>
              <p className="text-gray-600">Our system automatically matches your survey with qualified vendors in the right category.</p>
            </div>
            {/* Results */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Results</h3>
              <p className="text-gray-600">Receive high-quality responses and analyze them with our powerful analytics tools.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Survey Categories</h2>
            <p className="mt-4 text-lg text-gray-600">We support a wide range of survey categories to meet your needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Automobile', 'Food & Beverage', 'Healthcare', 'Education', 'Technology'].map(category => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 cursor-pointer transition">
                <p className="font-medium text-gray-800">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-lg text-indigo-100 mb-8">Join our marketplace today and start collecting valuable insights.</p>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
              Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">SurveyMarket</h3>
              <p className="text-gray-400">Connecting clients with the right vendors for targeted surveys.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">API Reference</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2023 SurveyMarket. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
