'use client';

import { useSupabase } from '@/src/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <button
      className={
        'inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-zinc-200 rounded-md p-1 hover:text-zinc-100 focus:outline-none focus:text-zinc-100 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50'
      }
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
