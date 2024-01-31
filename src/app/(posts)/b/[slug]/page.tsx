import SingleBlog from '@/src/app/(posts)/b/SingleBlog';
import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  // 한글 지원
  const lastSlug = decodeURIComponent(params.slug);
  try {
    const [post, postSections] = await Promise.all([
      getPost(lastSlug, 'blog'),
      getPostSectionsBySlug(lastSlug),
    ]);

    if (!post) {
      notFound();
    }

    return (
      <>
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
