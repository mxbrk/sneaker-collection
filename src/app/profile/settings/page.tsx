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
  genderFilter: string;
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
    genderFilter: 'both',
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
          genderFilter: data.user.genderFilter || 'both',
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
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      window.location.href = '/login';
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
    <MainLayout>
      <div className="min-h-screen bg-[#fafafa]">
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
                        <h4 className="font-medium text-[#171717]">Show Kids&apos; Shoes</h4>
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
                            Men&apos;s Only
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
                            Women&apos;s Only
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Change Password Section */}
                <div className="border-t border-[#f0f0f0] pt-8 mt-8">
                  <h3 className="text-lg font-medium text-[#171717] mb-3">Change Password</h3>
                  <p className="text-sm text-[#737373] mb-5">Leave blank if you don&apos;t want to change your password</p>
                  
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
{/* Privacy Policy Section - Collapsible */}
<div className="border-t border-[#f0f0f0] pt-8 mt-8" id="privacy-policy">
  <details className="group">
    <summary className="flex justify-between items-center cursor-pointer">
      <h3 className="text-lg font-medium text-[#171717]">Privacy Policy</h3>
      <div className="ml-2 text-[#d14124]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </summary>
    
    <div className="mt-5 bg-[#faf8f8] rounded-lg border border-[#f8e9e6] p-6">
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-[#171717] mb-3">Preamble</h4>
          <p className="text-[#737373]">
            With the following privacy policy, we would like to inform you about what types of your personal data (hereinafter also referred to as &quot;data&quot;) we process, for what purposes, and to what extent in connection with providing our application.
          </p>
          <p className="text-[#737373] mt-2">
            The terms used are not gender-specific.
          </p>
          <p className="text-[#737373] mt-2">
            Last updated: March 31, 2025
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">1. Controller</h4>
          <p className="text-[#737373]">
            Maximilian Bronkhorst<br />
            13351 Berlin
          </p>
          <p className="text-[#737373] mt-2">
            Email address: <a href="mailto:info@soleup.de" className="text-[#d14124]">info@soleup.de</a>
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">2. Overview of Processing</h4>
          <p className="text-[#737373]">
            The following overview summarizes the types of data processed and the purposes of their processing and refers to the persons concerned.
          </p>
          
          <h5 className="text-[#171717] mt-4 mb-2">Types of data processed</h5>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li>Inventory data</li>
            <li>Contact data</li>
            <li>Content data</li>
            <li>Usage data</li>
            <li>Meta, communication, and procedural data</li>
            <li>Log data</li>
          </ul>
          
          <h5 className="text-[#171717] mt-4 mb-2">Categories of persons concerned</h5>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li>Communication partners</li>
            <li>Users</li>
          </ul>
          
          <h5 className="text-[#171717] mt-4 mb-2">Purposes of processing</h5>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li>Communication</li>
            <li>Security measures</li>
            <li>Organizational and administrative procedures</li>
            <li>Feedback</li>
            <li>Provision of our online services and user-friendliness</li>
            <li>Information technology infrastructure</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">3. Relevant Legal Bases</h4>
          <p className="text-[#737373] mb-2">
            <strong>Relevant legal bases under the GDPR:</strong> Below you will find an overview of the legal bases of the GDPR on which we process personal data. Please note that in addition to the regulations of the GDPR, national data protection regulations may apply in your or our country of residence or domicile. Should more specific legal bases be relevant in individual cases, we will inform you of these in the privacy policy.
          </p>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li><strong>Consent (Art. 6(1)(a) GDPR)</strong> - The data subject has given consent to the processing of their personal data for one or more specific purposes.</li>
            <li><strong>Performance of a contract and pre-contractual inquiries (Art. 6(1)(b) GDPR)</strong> - Processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract.</li>
            <li><strong>Legitimate interests (Art. 6(1)(f) GDPR)</strong> - Processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data.</li>
          </ul>
          <p className="text-[#737373] mt-2">
            <strong>National data protection regulations in Germany:</strong> In addition to the data protection regulations of the GDPR, national regulations on data protection apply in Germany. These include, in particular, the Federal Data Protection Act (Bundesdatenschutzgesetz – BDSG). The BDSG contains special provisions on the right to information, the right to erasure, the right to object, the processing of special categories of personal data, processing for other purposes, and transmission, as well as automated individual decision-making, including profiling. Furthermore, state data protection laws of the individual federal states may apply.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">4. General Information on Data Storage and Deletion</h4>
          <p className="text-[#737373]">
            We delete personal data that we process in accordance with legal requirements as soon as the underlying consents are revoked or other legal grounds for processing no longer exist. This applies to cases where the original purpose of processing no longer applies or the data is no longer needed. Exceptions to this rule exist if statutory obligations or special interests require longer retention or archiving of the data.
          </p>
          <p className="text-[#737373] mt-2">
            In particular, data that must be retained for commercial or tax law reasons or whose storage is necessary for legal prosecution or for the protection of the rights of other natural or legal persons must be archived accordingly.
          </p>
          <p className="text-[#737373] mt-2">
            Our data protection notices contain additional information on the retention and deletion of data that specifically apply to certain processing processes.
          </p>
          <p className="text-[#737373] mt-2">
            If there are multiple retention periods or deletion deadlines for a piece of data, the longest deadline always applies.
          </p>
          <p className="text-[#737373] mt-2">
            If a deadline does not explicitly begin on a specific date and is at least one year, it automatically starts at the end of the calendar year in which the triggering event occurred. In the case of ongoing contractual relationships in which data is stored, the triggering event is the time when the termination or other end of the legal relationship becomes effective.
          </p>
          <p className="text-[#737373] mt-2">
            Data that is no longer needed for the originally intended purpose but is retained due to legal requirements or other reasons is processed exclusively for the reasons that justify its retention.
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Additional information on processing processes, procedures, and services:</strong>
          </p>
          <h5 className="text-[#171717] mt-4 mb-2">Retention and deletion of data:</h5>
          <p className="text-[#737373] mb-2">
            The following general deadlines apply to the retention and archiving according to German law:
          </p>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li>10 years - Retention period for books and records, annual financial statements, inventories, management reports, opening balance sheets, and the work instructions and other organizational documents required for their understanding.</li>
            <li>8 years - Accounting documents, such as invoices and expense receipts.</li>
            <li>6 years - Other business documents: received commercial or business letters, reproductions of sent commercial or business letters, other documents insofar as they are relevant for taxation.</li>
            <li>3 years - Data required to take into account potential warranty and compensation claims or similar contractual claims and rights and to process related inquiries, based on previous business experience and common industry practices, is stored for the duration of the regular statutory limitation period of three years.</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">5. Provision of Online Services and Web Hosting</h4>
          <p className="text-[#737373]">
            We process users&apos; data in order to provide them with our online services. For this purpose, we process the IP address of the user, which is necessary to transmit the content and functions of our online services to the user&apos;s browser or end device.
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Types of data processed:</strong> Usage data (e.g. page views and dwell time, click paths, usage intensity and frequency, device types and operating systems used, interactions with content and functions); meta, communication, and procedural data (e.g. IP addresses, time information, identification numbers, persons involved); log data (e.g. log files concerning logins or the retrieval of data or access times).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Data subjects:</strong> Users (e.g. website visitors, users of online services).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Purposes of processing:</strong> Provision of our online services and user-friendliness; information technology infrastructure (operation and provision of information systems and technical devices); security measures.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) GDPR).
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Additional information on processing processes, procedures, and services:</strong>
          </p>
          <h5 className="text-[#171717] mt-4 mb-2">Provision of online services on rented storage space:</h5>
          <p className="text-[#737373] mb-2">
            For the provision of our online services, we use storage space, computing capacity, and software that we rent or otherwise obtain from a corresponding server provider (also called a &quot;web host&quot;).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) GDPR).
          </p>
          <h5 className="text-[#171717] mt-4 mb-2">Collection of access data and log files:</h5>
          <p className="text-[#737373] mb-2">
            Access to our online service is logged in the form of &quot;server log files&quot;. The server log files may include the address and name of the web pages and files accessed, date and time of access, data volumes transferred, notification of successful access, browser type and version, the user&apos;s operating system, referrer URL (the previously visited page), and, as a rule, IP addresses and the requesting provider.
          </p>
          <p className="text-[#737373] mb-2">
            The server log files can be used for security purposes, e.g., to avoid overloading the servers (especially in case of abusive attacks, so-called DDoS attacks) and to ensure the servers&apos; load and stability.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) GDPR).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Deletion of data:</strong> Log file information is stored for a maximum of 30 days and then deleted or anonymized. Data whose further storage is necessary for evidentiary purposes is exempt from deletion until the respective incident is finally clarified.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">6. Use of Cookies</h4>
          <p className="text-[#737373]">
            The term &quot;cookies&quot; refers to functions that store information on users&apos; devices and read information from them. Cookies can further be used for various purposes, such as for the functionality, security, and comfort of online services as well as for the creation of analyses of visitor flows. We use cookies in accordance with legal regulations. If required, we obtain the prior consent of users. This is not necessary if the storing and reading of information, including cookies, is essential for providing explicitly requested content and functions. In such cases, we rely on our legitimate interests.
          </p>
          <p className="text-[#737373] mt-2">
            <strong>Notes on legal bases for data protection:</strong> Whether we process personal data using cookies depends on consent. If consent is given, it serves as the legal basis. Without consent, we rely on our legitimate interests, which are explained above in this section and in the context of the respective services and procedures.
          </p>
          <p className="text-[#737373] mt-2">
            <strong>Storage duration:</strong> With regard to storage duration, the following types of cookies are distinguished:
          </p>
          <ul className="list-disc pl-5 text-[#737373] space-y-1">
            <li><strong>Temporary cookies (also: session or session cookies):</strong> Temporary cookies are deleted at the latest after a user has left an online service and closed their end device (e.g. browser or mobile application).</li>
            <li><strong>Permanent cookies:</strong> Permanent cookies remain stored even after the end device is closed. For example, the login status can be saved and preferred content can be displayed directly when the user visits a website again. Likewise, user data collected with cookies can be used for reach measurement. If we do not provide users with explicit information about the type and storage duration of cookies (e.g. when obtaining consent), they should assume that the cookies are permanent and the storage duration can be up to two years.</li>
          </ul>
          <p className="text-[#737373] mt-2">
            <strong>General information on withdrawal and objection (opt-out):</strong> Users can withdraw consent they have given at any time and also object to processing in accordance with legal requirements, including via their browser&apos;s privacy settings.
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Types of data processed:</strong> Meta, communication, and procedural data (e.g. IP addresses, time information, identification numbers, persons involved).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Data subjects:</strong> Users (e.g. website visitors, users of online services).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) GDPR), Consent (Art. 6(1)(a) GDPR).
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Additional information on processing processes, procedures, and services:</strong>
          </p>
          <h5 className="text-[#171717] mt-4 mb-2">Processing of cookie data based on consent:</h5>
          <p className="text-[#737373] mb-2">
            We use a consent management solution to obtain, record, manage, and revoke user consent for the use of cookies or for the procedures and providers mentioned in the consent management solution. This process serves to obtain, record, manage, and revoke consent, particularly with regard to the use of cookies and similar technologies used to store, read, and process information on users&apos; devices.
          </p>
          <p className="text-[#737373] mb-2">
            As part of this process, users&apos; consent for the use of cookies and the associated processing of information, including the specific processing and providers mentioned in the consent management process, is obtained. Users also have the option to manage and revoke their consent. The consent declarations are stored to avoid having to repeat the query and to be able to prove consent in accordance with legal requirements. The storage takes place on the server side and/or in a cookie (so-called opt-in cookie) or by means of comparable technologies in order to be able to assign the consent to a specific user or their device.
          </p>
          <p className="text-[#737373] mb-2">
            If no specific information about the providers of consent management services is available, the following general information applies: The duration of the consent storage is up to two years. A pseudonymous user identifier is created, which is stored together with the time of consent, information about the scope of consent (e.g. concerning categories of cookies and/or service providers), and information about the browser, system, and end device used.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Consent (Art. 6(1)(a) GDPR).
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-[#171717] mb-3">7. Contact and Inquiry Management</h4>
          <p className="text-[#737373]">
            When contacting us (e.g. by mail, contact form, email, telephone, or via social media) and in the context of existing user and business relationships, the information provided by the inquiring persons is processed insofar as this is necessary to respond to the contact inquiries and any requested measures.
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Types of data processed:</strong> Inventory data (e.g. full name, address, customer number); contact data (e.g. postal and email addresses or telephone numbers); content data (e.g. text or image messages and posts, as well as information relating to them, such as authorship or creation time); usage data (e.g. page views and dwell time, click paths, usage intensity and frequency, device types and operating systems used, interactions with content and functions); meta, communication, and procedural data (e.g. IP addresses, time information, identification numbers, persons involved).
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Data subjects:</strong> Communication partners.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Purposes of processing:</strong> Communication; organizational and administrative procedures; feedback (e.g. collecting feedback via online forms); provision of our online services and user-friendliness.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Legitimate interests (Art. 6(1)(f) GDPR), Performance of a contract and pre-contractual inquiries (Art. 6(1)(b) GDPR).
          </p>
          <p className="text-[#737373] mt-4 mb-2">
            <strong>Additional information on processing processes, procedures, and services:</strong>
          </p>
          <h5 className="text-[#171717] mt-4 mb-2">Contact form:</h5>
          <p className="text-[#737373] mb-2">
            When contacting us via our contact form, by email, or other communication channels, we process the personal data transmitted to us to respond to and process the respective request. This usually includes information such as name, contact information, and potentially other information that is communicated to us and is necessary for appropriate processing. We use this data exclusively for the stated purpose of contact and communication.
          </p>
          <p className="text-[#737373] mb-2">
            <strong>Legal basis:</strong> Performance of a contract and pre-contractual inquiries (Art. 6(1)(b) GDPR), Legitimate interests (Art. 6(1)(f) GDPR).
          </p>
        </div>
      </div>
    </div>
  </details>
</div> 
  <div className="flex justify-between pt-4 mt-8 border-t border-[#f0f0f0]">
  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f8f8f8] transition shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>

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
    </MainLayout>
  );
}