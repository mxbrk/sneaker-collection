"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 shadow-sm">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3">
        {/* Logo with improved alignment */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="h-12 relative flex items-center">
              <Image
                src="/logo3.png"
                alt="Brand Logo"
                width={120}
                height={48}
                className="object-contain"
                priority
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'left center'
                }}
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-8">
          <ul className="flex space-x-8">
            <li>  
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium text-sm transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium text-sm transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            {user && (
              <li>
                <Link 
                  href="/collection" 
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium text-sm transition-colors duration-200"
                >
                  Collection
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Auth Buttons and Profile */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center justify-center w-8 h-8">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href="/profile" className="relative group">
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                  <Image
                    src="/favicon.ico"
                    alt="Profile"
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                  <span className="hidden sm:block text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {user.username}
                  </span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <Link href="/profile/wishlist" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Wishlist
                  </Link>
                  <Link href="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            data-collapse-toggle="navbar-sticky" 
            type="button" 
            className="md:hidden inline-flex items-center p-2 w-9 h-9 justify-center text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
            aria-controls="navbar-sticky" 
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu - Hidden by default */}
      <div className="hidden md:hidden" id="navbar-sticky">
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Link 
            href="/" 
            className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/sneaker" 
            className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            Sneaker
          </Link>
          <Link 
            href="/blog" 
            className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            Blog
          </Link>
          {user && (
            <Link 
              href="/profile/wishlist" 
              className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              Wishlist
            </Link>
          )}
          {user && (
            <>
              <Link 
                href="/profile" 
                className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Profile
              </Link>
              <Link 
                href="/profile/settings" 
                className="block py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left py-2 px-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;