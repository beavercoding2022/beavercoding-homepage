import { getSession } from '@/src/app/supabase-server';
import { getPosts } from '@/src/backend/posts';
import BlogList from '@/src/components/Posts/BlogList';
import CustomLink from '@/src/components/ui/CustomLink';
import getMostPreferredLanguage from '@/src/utils/getMostPreferredLanguage';
import { headers } from 'next/headers';

export default async function BlogIndexPage() {
  const [session, posts] = await Promise.all([getSession(), getPosts('blog')]);

  const [mostPreferredLanguage] = getMostPreferredLanguage(
    headers().get('accept-language'),
  );

  return (
    <div className="flex flex-col">
      {session && (
        <>
          <CustomLink href={'/b/write'}>Write Blog</CustomLink>
          <div className="mb-5" />
        </>
      )}
      <h1 className="text-3xl font-bold">Blog</h1>
      <BlogList
        initialPosts={posts}
        preferredLanguage={mostPreferredLanguage}
      />
    </div>
  );
}
