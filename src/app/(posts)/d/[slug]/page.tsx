import { getUser } from '@/src/app/supabase-server';
import { getPost } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import pathMapper from '@/src/utils/pathMapper';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

export default async function DocPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { mode?: 'edit' };
}) {
  // 한글 지원
  const decodedSlug = decodeURIComponent(params.slug);
  if (searchParams.mode === 'edit') {
    revalidatePath(pathMapper('docs', decodedSlug));
  }

  try {
    const [post, user] = await Promise.all([
      getPost(decodedSlug, 'docs'),
      getUser(),
    ]);

    return (
      <>
        {user && (
          <CustomLink
            prefetch={false}
            href={`${pathMapper('docs', decodedSlug)}/edit`}
            shallow={true}
          >
            Edit
          </CustomLink>
        )}
        <div className="p-2">
          <h1>Doc Page</h1>
          <pre>{JSON.stringify(post, null, 2)}</pre>
        </div>
        <CustomLink href="/d">Back to Document List</CustomLink>
      </>
    );
  } catch (error) {
    notFound();
  }
}
