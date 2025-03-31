'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { user } = useAuth();

  // Check if consent was already given on component mount
  useEffect(() => {
    // Don't run this on the server
    if (typeof window === 'undefined') return;
    
    // Only show the banner if consent hasn't been given yet
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    // Store consent in localStorage
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
  };

  // Don't show the banner if the user is logged in and no explicit check is needed
  // Or if banner should not be shown
  if (!showBanner || (user && localStorage.getItem('cookie-consent-registered'))) return null;

  // If user is logged in, also set a flag to not show this again for registered users
  const handleAccept = () => {
    acceptCookies();
    if (user) {
      localStorage.setItem('cookie-consent-registered', 'true');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-[#e5e5e5] p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-[#171717] mb-1">Use of Cookies</h3>
          <p className="text-sm text-[#737373]">
            We use cookies to optimize our website and continuously improve it for you. 
            By continuing to use the website, you agree to the use of cookies.
            For more information about cookies, please see our{' '}
            <Link href={user ? "/profile/settings#privacy-policy" : "/login"} className="text-[#d14124] underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-[#d14124] text-white rounded-lg py-2 px-4 hover:bg-[#b93a20] transition-colors whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
}