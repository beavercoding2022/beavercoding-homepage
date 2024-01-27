import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CustomLink from '@/src/components/ui/CustomLink';
import CopyText from '@/src/components/ui/CopyText';

export default async function PortfolioPost({
  params,
}: {
  params: { slug: string };
}) {
  // 한글 지원
  const lastSlug = decodeURIComponent(params.slug);

  const [post, postSections] = await Promise.all([
    getPost(lastSlug, 'portfolio'),
    getPostSectionsBySlug(lastSlug),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-2">
      <CustomLink href="/b">Back to Portfolio</CustomLink>
      <p />
      <CopyText
        text={`${process.env.VERCEL_URL || 'https://beavercoding.net'}/portfolio/${post.slug}`}
      >
        /portfolio/{post.slug}
      </CopyText>
      <h1>{post.title}</h1>
      {postSections.map((section) => (
        <div
          key={`${section.posts?.id || 'post'}_${section.id}`}
          className="border my-2 p-2"
        >
          <MDXRemote source={section.content} />
        </div>
      ))}
    </div>
  );
}
