import { getPostsByCategory } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import Image from 'next/image';

export default async function DocCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [posts] = await Promise.all([
    getPostsByCategory(params.category, 'docs'),
  ]);

  return (
    <>
      <div className="flex flex-row-reverse text-slate-500">
        <CustomLink href={`/c`}>Back to Category List</CustomLink>
      </div>
      {posts.map((post) => (
        <div key={`post_${post.id}`}>
          <CustomLink href={`/d/${post.slug}`}>{post.title}</CustomLink>
        </div>
      ))}
    </>
  );
}
