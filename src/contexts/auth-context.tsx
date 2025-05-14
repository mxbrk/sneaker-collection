// src/contexts/auth-context.tsx
// Replace the implementation with this fixed version

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr'; // Add this import

// Updated User interface with all properties
interface User {
  id: string;
  email: string;
  username: string | null;
  showKidsShoes?: boolean;
  genderFilter?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use SWR for efficient caching and revalidation
  const { data: userData, error: swrError, isLoading: swrLoading } = useSWR('/api/user', 
    async (url) => {
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    },
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
      errorRetryCount: 2
    }
  );

  // Update state based on SWR results
  useEffect(() => {
    setUser(userData || null);
    setLoading(swrLoading);
    setError(swrError ? (swrError as Error).message : null);
  }, [userData, swrError, swrLoading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logout', {