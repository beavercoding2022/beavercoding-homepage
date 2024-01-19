import { createClient } from '@/src/utils/supabase/server';
import ConnectSupabaseSteps from '@/src/components/ConnectSupabaseSteps';
import SignUpUserSteps from '@/src/components/SignUpUserSteps';
import Header from '@/src/components/Header';
import { cookies } from 'next/headers';

export default async function Index() {
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center"></div>
  );
}
