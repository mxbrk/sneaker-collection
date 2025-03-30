'use client';

import MainLayout from '@/components/MainLayout';
import { Button, FormError, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
  showKidsShoes: boolean;
  genderFilter: string; // Add this line
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showKidsShoes: true,
    genderFilter: 'both', // Add this line
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
          showKidsShoes: data.user.showKidsShoes ?? true,
          genderFilter: data.user.genderFilter || 'both', // Add this line
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
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
          showKidsShoes: formData.showKidsShoes,
          genderFilter: formData.genderFilter,
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
                Add Sneaker
              </Link>
              <Link
                href="/profile"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
      <Link 
            href="/profile"
            className="text-[#737373] hover:text-[#d14124] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Profile
          </Link>

        <div className="mb-8 flex items-center">
          <h1 className="text-2xl font-bold ml-4">Account Settings</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-[#f0f0f0] overflow-hidden">
          {/* Content Area */}
          <div className="p-8">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-8 bg-green-50 text-green-700 p-4 rounded-md">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
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
              
              {/* Display Preferences - with improved spacing and styling */}
              <div className="border-t border-[#f0f0f0] pt-8 mt-8">
                <h3 className="text-lg font-medium text-[#171717] mb-5">Search Preferences</h3>
                
                <div className="space-y-5">
                  {/* Kids' Shoes preference */}
                  <div className="flex items-center justify-between p-5 bg-[#faf8f8] rounded-lg border border-[#f8e9e6]">
                    <div>
                      <h4 className="font-medium text-[#171717]">Show Kids' Shoes</h4>
                      <p className="text-sm text-[#737373] mt-1">Display Infants, GS, TD, PS sizes in search results</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.showKidsShoes}
                        onChange={e => setFormData(prev => ({ ...prev, showKidsShoes: e.target.checked }))}
                      />
                      <div className="w-12 h-6 bg-[#e5e5e5] rounded-full peer-focus:ring-2 peer-focus:ring-[#fae5e1] peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d14124]"></div>
                    </label>
                  </div>
                  
                  {/* Gender Filter preference - NEW */}
                  <div className="flex flex-col p-5 bg-[#faf8f8] rounded-lg border border-[#f8e9e6]">
                    <div className="mb-4">
                      <h4 className="font-medium text-[#171717]">Gender Filter</h4>
                      <p className="text-sm text-[#737373] mt-1">Choose which types of sneakers to display in search results</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="genderFilter"
                          value="both"
                          checked={formData.genderFilter === 'both'}
                          onChange={() => setFormData(prev => ({ ...prev, genderFilter: 'both' }))}
                          className="sr-only"
                        />
                        <div className={`px-4 py-2 rounded-lg border cursor-pointer ${
                          formData.genderFilter === 'both' 
                            ? 'bg-[#d14124] text-white border-[#d14124]' 
                            : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#d14124]'
                        }`}>
                          All Sneakers
                        </div>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="genderFilter"
                          value="men"
                          checked={formData.genderFilter === 'men'}
                          onChange={() => setFormData(prev => ({ ...prev, genderFilter: 'men' }))}
                          className="sr-only"
                        />
                        <div className={`px-4 py-2 rounded-lg border cursor-pointer ${
                          formData.genderFilter === 'men' 
                            ? 'bg-[#d14124] text-white border-[#d14124]' 
                            : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#d14124]'
                        }`}>
                          Men's Only
                        </div>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="genderFilter"
                          value="women"
                          checked={formData.genderFilter === 'women'}
                          onChange={() => setFormData(prev => ({ ...prev, genderFilter: 'women' }))}
                          className="sr-only"
                        />
                        <div className={`px-4 py-2 rounded-lg border cursor-pointer ${
                          formData.genderFilter === 'women' 
                            ? 'bg-[#d14124] text-white border-[#d14124]' 
                            : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#d14124]'
                        }`}>
                          Women's Only
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Change Password Section */}
              <div className="border-t border-[#f0f0f0] pt-8 mt-8">
                <h3 className="text-lg font-medium text-[#171717] mb-3">Change Password</h3>
                <p className="text-sm text-[#737373] mb-5">Leave blank if you don't want to change your password</p>
                
                <div className="space-y-5">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={formErrors.currentPassword}
                    disabled={isLoading}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={formErrors.newPassword}
                        disabled={isLoading}
                      />
                      <div className="text-xs text-[#737373] mt-2">
                        Password must be at least 8 characters long.
                      </div>
                    </div>
                    
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
              
              <div className="flex justify-end pt-4 mt-8 border-t border-[#f0f0f0]">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2 w-auto inline-block"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );}