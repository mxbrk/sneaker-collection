'use client'

import React from 'react'

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <header className="flex items-center justify-between p-6 bg-black">
        <div className="text-xl font-bold">SneakerBrand</div>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-gray-400">Features</a>
          <a href="#about" className="hover:text-gray-400">About</a>
          <a href="#shop" className="hover:text-gray-400">Shop</a>
          <a href="#contact" className="hover:text-gray-400">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path-to-sneaker-image.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex justify-center items-center text-center text-white px-6">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Discover the Future of Sneakers</h1>
            <p className="text-lg">Innovative designs that take you further.</p>
            <a href="#shop" className="px-6 py-3 bg-blue-600 rounded-full text-xl font-semibold transition-all hover:bg-blue-700">Shop Now</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Our Sneakers?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="text-4xl">🔥</div>
              <h3 className="text-xl font-semibold">Style</h3>
              <p className="text-lg">Cutting-edge designs that will turn heads.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">💪</div>
              <h3 className="text-xl font-semibold">Comfort</h3>
              <p className="text-lg">Ergonomically designed for long-lasting comfort.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="text-xl font-semibold">Performance</h3>
              <p className="text-lg">Built to support your every move, on and off the track.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">About Us</h2>
          <p className="text-lg">We’re passionate about creating sneakers that combine form and function. Our mission is to bring innovation and style to your feet, offering products that enhance your performance and look great while doing it.</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 SneakerBrand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
