import SingleBlog from '@/src/app/(posts)/b/SingleBlog';
import { getUser } from '@/src/app/supabase-server';
import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import pathMapper from '@/src/utils/pathMapper';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

export default async function BlogPost({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { mode?: 'edit' };
}) {
  // 한글 지원
  const decodedSlug = decodeURIComponent(params.slug);
  if (searchParams.mode === 'edit') {
    revalidatePath(pathMapper('blog', decodedSlug));
  }

  try {
    const [post, postSections, user] = await Promise.all([
      getPost(decodedSlug, 'blog'),
      getPostSectionsBySlug(decodedSlug),
      getUser(),
    ]);

    if (!post) {
      notFound();
    }

    return (
      <>
        {user && (
          <CustomLink
            prefetch={false}
            href={`${pathMapper('blog', decodedSlug)}/edit`}
            shallow={true}
          >
            Edit
          </CustomLink>
        )}
        <div className="p-2">
          <SingleBlog post={post} postSections={postSections} />
        </div>
        <div className="flex flex-row-reverse text-slate-500">
          <CustomLink href="/b">Back to Blog List</CustomLink>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
