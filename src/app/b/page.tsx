import { getSession } from '@/src/app/supabase-server';
import { getPosts } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function BlogIndexPage() {
  const [session, posts] = await Promise.all([getSession(), getPosts()]);

  return (
    <div>
      {session && <CustomLink href={'/b/write'}>Write Blog</CustomLink>}
      {posts.map((post) => (
        <div key={post.id}>
          <p>
            id: {post.id}
            <CustomLink href={`/b/${post.slug}`}>{post.title}</CustomLink>
          </p>
        </div>
      ))}
    </div>
  );
}
