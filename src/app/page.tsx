"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  // For parallax effect
  const [scrollY, setScrollY] = useState(0);
  // For animated counters
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Sneaker categories
  const categories = [
    { id: 1, name: "Limited Edition", image: "/sneaker-limited.jpg", count: 156 },
    { id: 2, name: "Vintage", image: "/sneaker-vintage.jpg", count: 232 },
    { id: 3, name: "New Releases", image: "/sneaker-new.jpg", count: 89 },
    { id: 4, name: "Classics", image: "/sneaker-classic.jpg", count: 178 },
  ];
  
  // Featured sneakers
  const featuredSneakers = [
    { id: 1, name: "Air Max Supreme", brand: "Nike", price: "€299", image: "/featured-1.jpg" },
    { id: 2, name: "Ultraboost X", brand: "Adidas", price: "€249", image: "/featured-2.jpg" },
    { id: 3, name: "Classic Leather", brand: "Reebok", price: "€129", image: "/featured-3.jpg" },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      text: "This app completely transformed how I manage my growing sneaker collection. The interface is sleek and intuitive.",
      author: "Michael J.",
      role: "Sneaker Collector",
      avatar: "/avatar-1.jpg"
    },
    {
      id: 2,
      text: "As someone who trades sneakers regularly, this platform has become an essential tool in my arsenal.",
      author: "Sarah T.",
      role: "Sneaker Reseller",
      avatar: "/avatar-2.jpg"
    },
    {
      id: 3,
      text: "I love how easy it is to catalog and showcase my collection. The analytics features are a game-changer!",
      author: "Chris D.",
      role: "Sneakerhead",
      avatar: "/avatar-3.jpg"
    }
  ];

  // Stats for counter animation
  const stats = [
    { label: "Active Users", value: 15000, suffix: "+" },
    { label: "Sneakers Tracked", value: 250000, suffix: "+" },
    { label: "Collections Created", value: 45000, suffix: "+" },
  ];
  
  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Intersection observer for counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900"> {/* pt-20 to account for fixed navbar */}
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Parallax Hero Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
            backgroundImage: "url('/hero-sneakers.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)"
          }}
        />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Elevate Your <span className="text-blue-500">Sneaker Game</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8">
            Track, showcase, and manage your sneaker collection with our cutting-edge platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition duration-300 transform hover:scale-105">
                Get Started
              </button>
            </Link>
            <Link href="/sneaker">
              <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 rounded-lg text-lg font-medium transition duration-300">
                Explore Collection
              </button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white">
            Revolutionize How You <span className="text-blue-600 dark:text-blue-500">Manage Your Collection</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Track Your Collection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily catalog and organize your sneakers with our intuitive interface. Add details, photos, and custom notes to each pair.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Value Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor market values and track the performance of your collection over time with detailed analytics and insights.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Connect & Share</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a community of sneakerheads, share your collection, and discover rare finds from fellow collectors.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white">
            <span className="text-blue-600 dark:text-blue-500">Explore</span> Categories
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="group relative overflow-hidden rounded-xl shadow-lg h-64">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div 
                  className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} sneakers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Sneakers */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white">
            <span className="text-blue-600 dark:text-blue-500">Featured</span> Sneakers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredSneakers.map((sneaker) => (
              <div key={sneaker.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
                <div className="h-64 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${sneaker.image})` }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{sneaker.brand}</p>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{sneaker.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold dark:text-white">{sneaker.price}</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Counter */}
      <section ref={statsRef} className="py-20 px-4 bg-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {isVisible ? (
                    <>
                      {stat.value.toLocaleString()}{stat.suffix}
                    </>
                  ) : (
                    <>0{stat.suffix}</>
                  )}
                </div>
                <p className="text-xl text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white">
            What <span className="text-blue-600 dark:text-blue-500">Collectors</span> Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${testimonial.avatar})` }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Sneaker Collection?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of collectors who are tracking, showcasing, and analyzing their sneakers with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition duration-300 transform hover:scale-105">
                Start For Free
              </button>
            </Link>
            <Link href="/sneaker">
              <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 rounded-lg text-lg font-medium transition duration-300">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-12 px-4 text-gray-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="h-12 w-32 relative mb-4">
              <Image
                src="/logo3.png"
                alt="Brand Logo"
                width={128}
                height={48}
                className="object-contain"
              />
            </div>
            <p className="mb-4">The ultimate platform for sneaker collectors and enthusiasts.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/sneaker" className="hover:text-white transition">Collection</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/profile" className="hover:text-white transition">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
              <li><a href="#" className="hover:text-white transition">Marketplace</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Subscribe</h4>
            <p className="mb-4">Stay updated with the latest releases and features.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg focus:outline-none bg-gray-700 text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-white transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Sneaker Collection App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;