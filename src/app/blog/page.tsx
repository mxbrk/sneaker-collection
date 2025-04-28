'use client';

import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function BlogPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-[#fafafa] min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path fill="#d14124" d="M42.8,-68.2C56.9,-61.3,70.5,-52.1,78.3,-39.4C86.2,-26.7,88.2,-10.4,84.6,4.3C81.1,19,72,32.2,61.3,41.8C50.6,51.4,38.2,57.3,25.3,60.9C12.3,64.4,-1.2,65.5,-14.3,63.1C-27.4,60.7,-40.1,54.8,-49.4,45.5C-58.7,36.1,-64.5,23.3,-69.1,9.1C-73.8,-5.1,-77.3,-20.6,-71.5,-31.6C-65.8,-42.6,-50.6,-49.2,-36.9,-56C-23.1,-62.9,-11.6,-70,2.2,-73.5C15.9,-77,31.8,-76.9,42.8,-68.2Z" transform="translate(50 50)" />
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-[#171717] mb-4 tracking-tight">
                <span className="inline-block transform transition-transform hover:scale-105 duration-500">SoleUp</span>
                <span className="text-[#d14124]"> Blog</span>
              </h1>
              <p className="text-lg text-[#737373] max-w-2xl mx-auto mb-10 leading-relaxed">
                Your source for sneaker culture, collection tips, and the latest drops.
              </p>
              
              <div className="w-24 h-1 bg-[#d14124] mx-auto mb-10 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Coming Soon Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#f0f0f0] transform transition-all duration-300 hover:shadow-xl">
            <div className="md:flex">
              {/* Left Column - Graphic */}
              <div className="bg-gradient-to-br from-[#fae5e1] to-white md:w-2/5 p-8 flex items-center justify-center">
                <div className="text-[#d14124] w-32 h-32 md:w-40 md:h-40">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="inline-block px-3 py-1 rounded-full bg-[#fae5e1] text-[#d14124] text-sm font-medium mb-4">
                  Coming Soon
                </div>
                <h2 className="text-2xl font-bold text-[#171717] mb-4">We're Crafting Something Special</h2>
                <p className="text-[#737373] mb-8 leading-relaxed">
                  Our team is working on creating insightful content about sneaker culture, collection management, 
                  and the latest industry trends. The blog will launch soon with expert guides, news, and community stories.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/profile" 
                    className="px-6 py-3 bg-white border border-[#e5e5e5] text-[#171717] rounded-lg hover:bg-[#f8f8f8] transition-colors font-medium"
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
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-[#d14124]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">News & Releases</h3>
              <p className="text-[#737373] text-sm">
                Stay informed about the latest drops, restocks, and industry news in the sneaker world.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-[#d14124]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Collection Tips</h3>
              <p className="text-[#737373] text-sm">
                Expert guides on maintaining, displaying, and growing your sneaker collection effectively.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-[#d14124]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Community Spotlights</h3>
              <p className="text-[#737373] text-sm">
                Interviews and features on fellow collectors and their impressive sneaker collections.
              </p>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-20 bg-gradient-to-r from-[#fae5e1] to-white rounded-xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute right-0 bottom-0 w-40 h-40 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path fill="#d14124" d="M42.8,-68.2C56.9,-61.3,70.5,-52.1,78.3,-39.4C86.2,-26.7,88.2,-10.4,84.6,4.3C81.1,19,72,32.2,61.3,41.8C50.6,51.4,38.2,57.3,25.3,60.9C12.3,64.4,-1.2,65.5,-14.3,63.1C-27.4,60.7,-40.1,54.8,-49.4,45.5C-58.7,36.1,-64.5,23.3,-69.1,9.1C-73.8,-5.1,-77.3,-20.6,-71.5,-31.6C-65.8,-42.6,-50.6,-49.2,-36.9,-56C-23.1,-62.9,-11.6,-70,2.2,-73.5C15.9,-77,31.8,-76.9,42.8,-68.2Z" transform="translate(50 50)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:pr-12">
                  <h3 className="text-xl font-bold text-[#171717] mb-3">Be the First to Know</h3>
                  <p className="text-[#737373] leading-relaxed">
                    Subscribe to get notified when our blog launches. We'll send you updates 
                    about new articles, exclusive content, and special sneaker events.
                  </p>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                  <Link 
                    href="/profile/settings" 
                    className="w-full md:w-auto px-8 py-4 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Enable Notifications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}