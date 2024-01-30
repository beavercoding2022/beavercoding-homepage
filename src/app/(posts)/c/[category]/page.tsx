import { getPostsByCategory } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import { notFound } from 'next/navigation';

export default async function DocCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  try {
    const [posts] = await Promise.all([getPostsByCategory(params.category)]);

    return (
      <>
        {posts.map((post) => (
          <div key={`post_${post.id}`}>
            <CustomLink post={post}>
              {post.title} ({post.posting_type})
            </CustomLink>
          </div>
        ))}
        <div className="flex flex-row-reverse text-slate-500">
          <CustomLink href={`/c`}>Back to Category List</CustomLink>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
