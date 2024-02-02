'use client';

import CustomLink from '@/src/components/ui/CustomLink';
import SignOutButton from './SignOutButton';
import { useSupabase } from '@/src/app/supabase-provider';

export default function Navbar() {
  const { isSignedIn } = useSupabase();

  return (
    <nav className="top-0 z-40 transition-all duration-150">
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="hidden sm:block max-w-screen-lg px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center">
          <div className="flex items-center flex-1">
            <nav className="space-x-2">
              <CustomLink href="/">Home</CustomLink>
              <CustomLink href="/about">About</CustomLink>
              <CustomLink href="/portfolio">Portfolio</CustomLink>
              <CustomLink href="/b">Blog</CustomLink>
              <CustomLink href="/d">Docs</CustomLink>
              <CustomLink href="/c">Categories</CustomLink>
              <CustomLink href="/s">Showcase</CustomLink>
            </nav>
          </div>
          <div className="flex justify-end space-x-8">
            {isSignedIn ? (
              <>
                <CustomLink href="/account">Account</CustomLink>
                <SignOutButton />
              </>
            ) : (
              <CustomLink href="/sign-in">Sign in</CustomLink>
            )}
          </div>
        </div>
      </div>
      <div className="sm:hidden flex flex-row flex-wrap">
        <CustomLink href="/">Home</CustomLink>
        <CustomLink href="/about">About</CustomLink>
        <CustomLink href="/portfolio">Portfolio</CustomLink>
        <CustomLink href="/b">Blog</CustomLink>
        <CustomLink href="/d">Docs</CustomLink>
        <CustomLink href="/c">Categories</CustomLink>
        <CustomLink href="/s">Showcase</CustomLink>
        {isSignedIn ? (
          <>
            <CustomLink href="/account">Account</CustomLink>
            <SignOutButton />
          </>
        ) : (
          <CustomLink href="/sign-in">Sign in</CustomLink>
        )}
      </div>
    </nav>
  );
}
