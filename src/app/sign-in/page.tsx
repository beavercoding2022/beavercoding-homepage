import { getSession } from '@/src/app/supabase-server';
import { redirect } from 'next/navigation';
import AuthUI from './AuthUI';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/src/types_db';
import { cookies } from 'next/headers';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/account');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <AuthUI />
      </div>
    </div>
  );
}
