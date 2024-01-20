import { getSession } from '@/src/app/supabase-server';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function DocIndexPage() {
  const [session] = await Promise.all([getSession()]);

  return (
    <div>
      <h1>Doc Page</h1>
      <p>Doc Page</p>
      {session && <CustomLink href={'/b/write'}>Write Blog</CustomLink>}
    </div>
  );
}
