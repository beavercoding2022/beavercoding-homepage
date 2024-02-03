'use client';

import { Button } from '@/components/ui/button';
import { useSupabase } from '@/src/app/supabase-provider';
import { getURL } from '@/src/utils/helpers';
import { useRouter } from 'next/navigation';

export default function AuthUI() {
  const { supabase } = useSupabase();
  const { refresh } = useRouter();

  // https://supabase.com/docs/guides/auth/social-login/auth-github?language=js
  async function signInWithGithub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    refresh();
  }

  return (
    <div className="flex flex-col space-y-4">
      <Button variant={'outline'} onClick={signInWithGithub}>
        Sign In With Github
      </Button>
    </div>
  );
}
