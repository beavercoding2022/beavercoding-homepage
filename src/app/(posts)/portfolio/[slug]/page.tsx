import SinglePortfolio from '@/src/app/(posts)/portfolio/SinglePortfolio';
import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import { notFound } from 'next/navigation';

export default async function PortfolioPost({
  params,
}: {
  params: { slug: string };
}) {
  // 한글 지원
  const lastSlug = decodeURIComponent(params.slug);
  try {
    const [post, postSections] = await Promise.all([
      getPost(lastSlug, 'portfolio'),
      getPostSectionsBySlug(lastSlug),
    ]);

    if (!post) {
      notFound();
    }

    return (
      <>
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
