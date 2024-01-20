import { createServerSupabaseClient } from '@/src/app/supabase-server';
import SignOutButton from './SignOutButton';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className={' top-0 z-40 transition-all duration-150 h-16 md:h-20'}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto bg-slate-100 dark:bg-slate-700">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <nav className="ml-6 space-x-2">
              <CustomLink href="/">Home</CustomLink>
              <CustomLink href="/about">About</CustomLink>
              <CustomLink href="/portfolio">Portfolio</CustomLink>
              <CustomLink href="/b">Blog</CustomLink>
              <CustomLink href="/d">Docs</CustomLink>
              {user && <CustomLink href="/account">Account</CustomLink>}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              <SignOutButton />
            ) : (
              <CustomLink href="/sign-in">Sign in</CustomLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
