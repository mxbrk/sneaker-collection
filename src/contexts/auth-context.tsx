'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Updated User interface with all properties
interface User {
  id: string;
  email: string;
  username: string | null;
  showKidsShoes?: boolean; // Add this property
  genderFilter?: string;    // Add this property
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
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const cacheValidityTime = 60000; // Cache für 1 Minute gültig

  useEffect(() => {
    const fetchUser = async () => {
      // Optimierter Cache-Check mit SWR-ähnlichem Ansatz
      const now = Date.now();
      const shouldRefetch = !user || (now - lastFetchTime > cacheValidityTime);
      
      if (!shouldRefetch) {
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true); // Nur setzen, wenn wir wirklich laden
        const response = await fetch('/api/user', {
          // Wichtig: Verhindert Caching durch den Browser
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setLastFetchTime(now);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [lastFetchTime, user, cacheValidityTime]);

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
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Explicitly set user to null
      setUser(null);
      
      // No need to return or redirect here, let the component handle that
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}