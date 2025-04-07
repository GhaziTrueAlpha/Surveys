import React from 'react';
import { Link } from 'wouter';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
              {linkText && linkHref && (
                <>
                  {' '}
                  <Link href={linkHref}>
                    <a className="font-medium text-primary hover:text-indigo-500">{linkText}</a>
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
