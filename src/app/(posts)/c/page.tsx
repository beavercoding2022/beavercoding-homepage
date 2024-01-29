import { getSession } from '@/src/app/supabase-server';
import { getValidCategories } from '@/src/backend/posts';
import CategoryIcon from '@/src/components/icons/CategoryIcon';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function DocIndexPage() {
  const [session, categories] = await Promise.all([
    getSession(),
    getValidCategories('docs'),
  ]);

  return (
    <div className="flex flex-col max-w-screen-md">
      {session && (
        <>
          <CustomLink href={'/d/write'}>Write Document</CustomLink>
          <div className="mb-5" />
        </>
      )}
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="mb-5" />
      <ul>
        {categories.map((category) => (
          <div key={`category_${category.id}`}>
            <CustomLink href={`/c/${category.slug}`}>
              {category.name}
              <CategoryIcon {...category} />({category.posts.length})
            </CustomLink>
          </div>
        ))}
      </ul>
    </div>
  );
}
