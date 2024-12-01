import { getUser } from '@/src/app/supabase-server';
import WriterWrapper from '@/src/components/Writer/WriterWrapper';
import { redirect } from 'next/navigation';

export default async function WritePortfolioPost() {
  const user = await getUser();

  // TODO: Add a check for the user's role instead of checking ID
  if (user?.id !== 'e979672e-8d67-447b-9abc-ef13bbfe588d') {
    redirect('/');
  }

  return <WriterWrapper posting_type={'portfolio'} />;
}
