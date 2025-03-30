'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#d14124]">
            Sneaker Collection
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-[#fae5e1] text-[#d14124]' 
                  : 'text-[#171717] hover:bg-[#f5f5f5]'
              }`}
            >
              Home
            </Link>
            
            {/* Only show Search link for logged-in users */}
            {user && (
              <Link
                href="/search"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/search') 
                    ? 'bg-[#fae5e1] text-[#d14124]' 
                    : 'text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Search
              </Link>
            )}
            
            {user ? (
              // User is logged in
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-[#fae5e1] text-[#d14124]' 
                    : 'text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Profile
              </Link>
            ) : !loading ? (
              // User is not logged in and auth is not loading
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'bg-[#fae5e1] text-[#d14124]' 
                      : 'text-[#171717] hover:bg-[#f5f5f5]'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/signup') 
                      ? 'bg-[#fae5e1] text-[#d14124]' 
                      : 'text-[#171717] hover:bg-[#f5f5f5]'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : null /* Show nothing while loading */}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#171717] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden p-4 border-t border-[#e5e5e5] bg-white">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-[#fae5e1] text-[#d14124]' 
                  : 'text-[#171717] hover:bg-[#f5f5f5]'
              }`}
            >
              Home
            </Link>
            {/* Only show Search link for logged-in users in mobile menu */}
            {user && (
              <Link
                href="/search"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/search') 
                    ? 'bg-[#fae5e1] text-[#d14124]' 
                    : 'text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Search
              </Link>
            )}
            
            {user ? (
              // User is logged in
              <Link
                href="/profile"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-[#fae5e1] text-[#d14124]' 
                    : 'text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Profile
              </Link>
            ) : !loading ? (
              // User is not logged in and auth is not loading
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'bg-[#fae5e1] text-[#d14124]' 
                      : 'text-[#171717] hover:bg-[#f5f5f5]'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/signup') 
                      ? 'bg-[#fae5e1] text-[#d14124]' 
                      : 'text-[#171717] hover:bg-[#f5f5f5]'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : null /* Show nothing while loading */}
          </nav>
        </div>
      )}
    </header>
  );
}