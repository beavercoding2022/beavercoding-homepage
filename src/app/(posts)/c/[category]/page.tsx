import { getPostsByCategory } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function DocCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [posts] = await Promise.all([getPostsByCategory(params.category)]);

  return (
    <>
      <div className="flex flex-row-reverse text-slate-500">
        <CustomLink href={`/c`}>Back to Category List</CustomLink>
      </div>
      {posts.map((post) => (
        <div key={`post_${post.id}`}>
          <CustomLink post={post}>{post.title}</CustomLink>
        </div>
      ))}
    </>
  );
}
