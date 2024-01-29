import { getSession } from '@/src/app/supabase-server';
import { getValidCategories } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import Image from 'next/image';

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
      <h1 className="text-3xl font-bold">Documents</h1>
      <div className="mb-5" />
      <ul>
        {categories.map((category) => (
          <div key={`category_${category.id}`}>
            <CustomLink href={`/c/${category.slug}`}>
              {category.name}
              {category.thumbnail_url && (
                <Image
                  src={category.thumbnail_url}
                  alt={category.name}
                  width={30}
                  height={30}
                  priority={false}
                />
              )}
              ({category.posts.length})
            </CustomLink>
          </div>
        ))}
      </ul>
    </div>
  );
}
