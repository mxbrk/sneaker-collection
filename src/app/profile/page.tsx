'use client';

import { Button, FormError, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);

        // Initialize form data with current user data
        setFormData(prevData => ({
          ...prevData,
          username: data.user.username || '',
          email: data.user.email || '',
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccessMessage(null);
    
    // Reset form errors when toggling
    setFormErrors({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    // Reset password fields when canceling edit
    if (isEditing) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    
    // Username validation
    if (formData.username.trim() === '') {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === '') {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Password validation (only if user is trying to change password)
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
        isValid = false;
      }
      
      if (formData.newPassword.length > 0 && formData.newPassword.length < 8) {
        errors.newPassword = 'New password must be at least 8 characters';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccessMessage(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409 && data.field) {
          // Handle duplicate email/username
          setFormErrors(prev => ({
            ...prev,
            [data.field]: data.error || `This ${data.field} is already in use`
          }));
          throw new Error(data.error || 'Update failed');
        } else if (response.status === 401 && data.field === 'currentPassword') {
          setFormErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is incorrect'
          }));
          throw new Error('Current password is incorrect');
        } else {
          throw new Error(data.error || 'Update failed');
        }
      }
      
      // Update was successful
      setUser(data.user);
      setSuccessMessage('Profile updated successfully');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[#d14124]">
              Sneaker Collection
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Search
              </Link>
              <Link
                href="/profile"
                className="bg-[#fae5e1] text-[#d14124] px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#f0f0f0] overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#fae5e1] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#d14124] rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                  {user?.username || 'User'}
                </h1>
                <p className="text-[#737373] mt-">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{
                  year: "numeric",
                  month: "long"
                }) : 'Unknown'}</p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Button 
                    onClick={toggleEditMode}
                    className={`px-4 py-2 w-auto inline-block ${isEditing ? 'bg-gray-200 text-[#171717] hover:bg-gray-300' : ''}`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    className="px-4 py-2 w-auto inline-block bg-red-500 text-white hover:bg-red-600 border-none"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md">
                {successMessage}
              </div>
            )}
            
            {error && !isEditing && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            {isEditing ? (
              /* Edit Profile Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormError message={error || undefined} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={formErrors.username}
                    disabled={isLoading}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={formErrors.email}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="border-t border-[#f0f0f0] pt-6">
                  <h3 className="text-lg font-medium text-[#171717] mb-4">Change Password</h3>
                  <p className="text-sm text-[#737373] mb-4">Leave blank if you don't want to change your password</p>
                  
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      error={formErrors.currentPassword}
                      disabled={isLoading}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={formErrors.newPassword}
                        disabled={isLoading}
                      />
                      
                      <Input
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formErrors.confirmPassword}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6 py-2 w-auto inline-block"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              /* Profile View */
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-[#d14124] mb-4">Profile Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#f8f8f8] p-4 rounded-lg">
                      <p className="text-sm text-[#737373] mb-1">Username</p>
                      <p className="font-medium">{user?.username || 'Not set'}</p>
                    </div>
                    <div className="bg-[#f8f8f8] p-4 rounded-lg">
                      <p className="text-sm text-[#737373] mb-1">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>

                  </div>
                </div>
                
                <div className="border-t border-[#f0f0f0] pt-6">
                  <h2 className="text-xl font-semibold text-[#d14124] mb-4">Account Activity</h2>
                  <div className="bg-[#fae5e1] rounded-lg p-6 text-center">
                    <p className="text-lg font-medium mb-2">Coming Soon</p>
                    <p className="text-[#737373]">
                      Activity tracking and sneaker collection management will be available in a future update.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}