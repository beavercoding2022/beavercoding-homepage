import { getSession } from '@/src/app/supabase-server';
import { getPosts } from '@/src/backend/posts';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';
import CustomLink from '@/src/components/ui/CustomLink';
import Image from 'next/image';

export default async function DocIndexPage() {
  const [session, posts] = await Promise.all([getSession(), getPosts('docs')]);

  return (
    <div className="flex flex-col max-w-screen-md">
      {session && (
        <>
          <CustomLink href={'/d/write'}>Write Document</CustomLink>
          <div className="mb-5" />
        </>
      )}
      <h1 className="text-3xl font-bold">Documents</h1>
      <div className="mb-5" />
      <ul>
        {posts.map((post) => (
          <div key={`post_${post.id}`} className="flex flex-row items-center">
            <CustomLink href={`/d/${post.slug}`}>{post.title}</CustomLink>
            <div className="flex flex-row">
              {post.categories
                .filter((category) => category.thumbnail_url)
                .map((category) => (
                  <CategoryLinkWithIcon
                    {...category}
                    onlyIcon
                    key={`category_${category.id}`}
                  />
                ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
