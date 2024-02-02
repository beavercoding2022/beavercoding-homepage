import SingleDocument from '@/src/app/(posts)/d/SingleDocument';
import { getUser } from '@/src/app/supabase-server';
import {
  getPost,
  getPostSections,
  getPostSectionsBySlug,
} from '@/src/backend/posts';
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
    const [post, postSections, user] = await Promise.all([
      getPost(decodedSlug, 'docs'),
      getPostSectionsBySlug(decodedSlug),
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
          <SingleDocument
            post={post}
            postSections={postSections}
            path={pathMapper('docs', decodedSlug)}
          />
        </div>
        <CustomLink href="/d">Back to Document List</CustomLink>
      </>
    );
  } catch (error) {
    notFound();
  }
}
