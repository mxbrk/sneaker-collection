'use client';

import { Button, FormContainer, FormError, Input } from '@/components/ui';
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if user is already logged in - but use a state to prevent redirecting multiple times
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    if (user && !loading && !redirecting) {
      setRedirecting(true);
      router.push('/profile');
    }
  }, [user, loading, router, redirecting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      // After successful login, manually redirect instead of waiting for useEffect
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  // Only show loading state when loading auth or when manually redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is logged in, show redirecting state
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Already logged in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md">
          <FormContainer
            title="Login"
            subtitle="Welcome back! Please enter your details."
            onSubmit={handleSubmit}
          >
            <FormError message={error || undefined} />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign in'}
            </Button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#d14124] hover:underline">
                Sign up
              </Link>
            </p>
          </FormContainer>
        </div>
      </div>
    </MainLayout>
  );
}