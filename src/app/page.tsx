"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#fafafa]">
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-[#f0f0f0] bg-white">
        <div className="flex items-center gap-2">
          <Image
            src="/logo1.png"
            width={150}
            height={150}
            alt="SoleUp logo"
            className="object-contain"
          />
        </div>
        <nav className="flex gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="px-4 py-2 rounded-lg border border-[#e5e5e5] text-[#171717] hover:border-[#d14124] hover:text-[#d14124] transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors"
              >
                Add Sneakers
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-[#e5e5e5] text-[#171717] hover:border-[#d14124] hover:text-[#d14124] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-8 flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-[#fae5e1] opacity-40 rounded-bl-full"></div>
            <div className="absolute left-0 bottom-0 w-1/4 h-1/4 bg-[#fae5e1] opacity-30 rounded-tr-full"></div>
          </div>
          
          <div className="max-w-5xl w-full relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left Column - Text */}
              <div className="md:w-3/5 mb-10 md:mb-0 md:pr-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#171717] mb-4">
                  Welcome to <span className="text-[#d14124]">SoleUp</span>
                </h1>
                <p className="text-lg text-[#737373] mb-8 leading-relaxed">
                  Track your sneaker collection, discover new releases, and connect with fellow enthusiasts. 
                  The ultimate platform for sneakerheads to manage their collections.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="px-6 py-3 rounded-lg border border-[#e5e5e5] text-[#171717] hover:bg-[#fdf1f0] hover:border-[#d14124] transition-colors"
                      >
                        View Your Profile
                      </Link>
                      <Link
                        href="/search"
                        className="px-6 py-3 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors shadow-md"
                      >
                        Add Sneakers
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="px-6 py-3 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors shadow-md"
                      >
                        Get Started
                      </Link>
                      <Link
                        href="/login"
                        className="px-6 py-3 rounded-lg border border-[#e5e5e5] text-[#171717] hover:bg-[#fdf1f0] hover:border-[#d14124] transition-colors"
                      >
                        I Already Have an Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              {/* Right Column - Placeholder Kachel */}
              <div className="md:w-2/5 flex justify-center md:justify-end">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {/* Stylisierte rötliche Kachel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fae5e1] to-white rounded-3xl transform rotate-12 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#171717] mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 bg-[#fafafa] rounded-xl border border-[#f0f0f0] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#fae5e1] text-[#d14124] rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#171717]">Collection Management</h3>
                <p className="text-[#737373]">Track your sneaker collection with detailed information including size, condition, and purchase details.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="p-6 bg-[#fafafa] rounded-xl border border-[#f0f0f0] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#fae5e1] text-[#d14124] rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#171717]">Sneaker Blog</h3>
                <p className="text-[#737373]">Stay updated with news, trends, and guides from the sneaker community on our blog.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="p-6 bg-[#fafafa] rounded-xl border border-[#f0f0f0] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#fae5e1] text-[#d14124] rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#171717]">Wishlist</h3>
                <p className="text-[#737373]">Save sneakers you want to purchase in the future and keep track of your most wanted items.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-8 bg-gradient-to-r from-[#fae5e1] to-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#171717] mb-4">Ready to organize your collection?</h2>
            <p className="text-[#737373] mb-8">Join SoleUp today and take your sneaker collection to the next level.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link
                  href="/profile"
                  className="px-8 py-3 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors shadow-md"
                >
                  Go to My Collection
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="px-8 py-3 rounded-lg bg-[#d14124] text-white hover:bg-[#b93a20] transition-colors shadow-md"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-8 border-t border-[#f0f0f0] bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#737373] text-sm">SoleUp &copy; {new Date().getFullYear()}</p>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/blog" className="text-[#737373] hover:text-[#d14124] text-sm">
              Blog
            </Link>
            <Link href="/profile/settings" className="text-[#737373] hover:text-[#d14124] text-sm">
              Settings
            </Link>
            <Link href="/profile" className="text-[#737373] hover:text-[#d14124] text-sm">
              My Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}