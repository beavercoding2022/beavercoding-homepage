import SinglePortfolio from '@/src/app/(posts)/portfolio/SinglePortfolio';
import { getUser } from '@/src/app/supabase-server';
import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import pathMapper from '@/src/utils/pathMapper';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

export default async function PortfolioPost({
  searchParams,
  params,
}: {
  params: { slug: string };
  searchParams: { mode?: 'edit' };
}) {
  // 한글 지원
  const decodedSlug = decodeURIComponent(params.slug);
  if (searchParams.mode === 'edit') {
    revalidatePath(pathMapper('portfolio', decodedSlug));
  }
  try {
    const [post, postSections, user] = await Promise.all([
      getPost(decodedSlug, 'portfolio'),
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
            href={`${pathMapper('portfolio', decodedSlug)}/edit`}
            shallow={true}
          >
            Edit
          </CustomLink>
        )}
        <div className="p-2">
          <SinglePortfolio post={post} postSections={postSections} />
        </div>
        <div className="flex flex-row-reverse text-slate-500">
          <CustomLink href="/portfolio">Back to Portfolio List</CustomLink>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
