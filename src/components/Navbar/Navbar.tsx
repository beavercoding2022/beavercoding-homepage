import { createServerSupabaseClient } from '@/src/app/supabase-server';
import Link from 'next/link';
import styles from './Navbar.module.css';
import SignOutButton from './SignOutButton';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className={styles.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <nav className="hidden ml-6 space-x-2 lg:block">
              {user && (
                <Link href="/account" className={styles.link}>
                  Account
                </Link>
              )}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              <SignOutButton />
            ) : (
              <Link href="/sign-in" className={styles.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
