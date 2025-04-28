'use client';

import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function BlogPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="bg-[#fafafa] min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#171717] mb-4"><span className="text-[#d14124]"> SoleUp </span> Blog</h1>
            <p className="text-[#737373] text-lg max-w-2xl mx-auto">
              Stay tuned for sneaker news, collection tips, and updates from the SoleUp community.
            </p>
          </div>
          
          {/* Coming Soon Section */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] p-10 text-center">
            <div className="mx-auto w-24 h-24 mb-6 text-[#d14124] opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#171717] mb-4">Blog Coming Soon</h2>
            <p className="text-[#737373] mb-8 max-w-lg mx-auto">
              We're working on creating insightful sneaker content. Our blog will launch soon with articles, guides, and news about the latest trends and opinions in the sneaker world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/profile" 
                className="px-6 py-3 bg-[#fae5e1] text-[#d14124] rounded-lg hover:bg-[#f8d5ce] transition-colors font-medium"
              >
                Back to Profile
              </Link>
              <Link 
                href="/search" 
                className="px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors font-medium"
              >
                Explore Sneakers
              </Link>
            </div>
          </div>
          
          {/* Newsletter Signup Teaser */}
          <div className="mt-12 bg-gradient-to-r from-[#fae5e1] to-[#fcf5f3] rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold text-[#171717] mb-2">Get Notified When We Launch</h3>
                <p className="text-[#737373]">Be the first to know when our blog goes live.</p>
              </div>
              
              <div className="w-full md:w-auto">
                <Link 
                  href="/profile/settings" 
                  className="w-full md:w-auto px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors font-medium flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Update Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}