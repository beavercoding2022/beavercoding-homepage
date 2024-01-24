import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function BlogPost({
  params,
}: {
  params: { slug: string[] };
}) {
  const [post, postSections] = await Promise.all([
    getPost(params.slug[params.slug.length - 1], 'blog'),
    getPostSectionsBySlug(params.slug[params.slug.length - 1]),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-2">
      <CustomLink href="/b">Back to Blog</CustomLink>
      <CustomLink href={`/b/${post.slug}`}>/b/{post.slug}</CustomLink>
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
