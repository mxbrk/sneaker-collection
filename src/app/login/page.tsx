'use client';

import { Button, FormContainer, FormError, Input } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to profile page
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#d14124]">Sneaker Collection</h1>
        </div>
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
  );
}