import { getSession } from '@/src/app/supabase-server';
import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import { notFound } from 'next/navigation';

export default async function BlogPost({
  params,
}: {
  params: { slug: string[] };
}) {
  const [post, postSections] = await Promise.all([
    getPost(params.slug[params.slug.length - 1], 'docs'),
    getPostSectionsBySlug(params.slug[params.slug.length - 1]),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <h1>{post.title}</h1>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <pre>{JSON.stringify(postSections, null, 2)}</pre>
    </>
  );
}
