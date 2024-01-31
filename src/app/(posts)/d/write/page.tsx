import { createServerSupabaseClient } from '@/src/app/supabase-server';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const Writer = dynamic(() => import('@/src/components/Writer/Writer'), {
  ssr: false,
});

export default async function WriteDoc() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id !== 'e979672e-8d67-447b-9abc-ef13bbfe588d') {
    redirect('/');
  }

  return <Writer posting_type={'docs'} />;
}
