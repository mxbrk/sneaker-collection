'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#d14124]">Sneaker Collection</span>
        </div>
        <nav className="flex gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg border border-solid border-[#e5e5e5] px-4 py-2 hover:bg-[#fdf1f0] transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/search"
                className="rounded-lg bg-[#d14124] text-white px-4 py-2 hover:bg-[#b93a20] transition-colors"
              >
                Add Sneakers
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-solid border-[#e5e5e5] px-4 py-2 hover:bg-[#fdf1f0] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#d14124] text-white px-4 py-2 hover:bg-[#b93a20] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-col gap-[32px] items-center text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to <span className="text-[#d14124]">Sneaker Collection</span>
        </h1>
        <p className="text-xl text-foreground/70">
          A modern, secure, and scalable application built with Next.js, Prisma, and Tailwind CSS.
        </p>

        <div className="flex gap-4 items-center flex-wrap justify-center mt-8">
          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-[#d14124] text-white gap-2 hover:bg-[#b93a20] font-medium text-sm sm:text-base h-12 px-6"
              >
                View Your Profile
              </Link>
              <Link
                href="/search"
                className="rounded-lg border border-solid border-[#e5e5e5] transition-colors flex items-center justify-center hover:bg-[#fdf1f0] font-medium text-sm sm:text-base h-12 px-6"
              >
                Add Sneakers
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-[#d14124] text-white gap-2 hover:bg-[#b93a20] font-medium text-sm sm:text-base h-12 px-6"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-solid border-[#e5e5e5] transition-colors flex items-center justify-center hover:bg-[#fdf1f0] font-medium text-sm sm:text-base h-12 px-6"
              >
                Login
              </Link>
            </>
          )}
          <Link
            href="https://nextjs.org/docs"
            className="rounded-lg border border-solid border-[#e5e5e5] transition-colors flex items-center justify-center hover:bg-[#fdf1f0] font-medium text-sm sm:text-base h-12 px-6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </Link>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto text-center text-sm text-foreground/70">
        <p>Sneaker Collection &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}