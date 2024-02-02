'use client';

import { Button } from '@/components/ui/button';
import { useSupabase } from '@/src/app/supabase-provider';

export default function AuthUI() {
  const { supabase } = useSupabase();

  // https://supabase.com/docs/guides/auth/social-login/auth-github?language=js
  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000',
      },
    });
  }

  return (
    <div className="flex flex-col space-y-4">
      <Button variant={'outline'} onClick={signInWithGithub}>
        Sign In With Github
      </Button>
    </div>
  );
}
