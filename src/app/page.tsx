import { getCurrentUser } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const user = await getCurrentUser();
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
        </div>
        <nav className="flex gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-foreground text-background px-4 py-2 hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-col gap-[32px] items-center text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to Sneaker Collection
        </h1>
        <p className="text-xl text-foreground/70">
          A modern, secure, and scalable application built with Next.js, Prisma, and Tailwind CSS.
        </p>

        <div className="flex gap-4 items-center flex-wrap justify-center mt-8">
          {user ? (
            <Link
              href="/profile"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-6"
            >
              View Your Profile
            </Link>
          ) : (
            <Link
              href="/signup"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-6"
            >
              Get Started
            </Link>
          )}
          <Link
            href="https://nextjs.org/docs"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6"
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