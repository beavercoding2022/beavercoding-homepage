import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';

export default async function BlogPost({
  params,
}: {
  params: { slug: string[] };
}) {
  const [post, postSections] = await Promise.all([
    getPost(params.slug[params.slug.length - 1]),
    getPostSectionsBySlug(params.slug[params.slug.length - 1]),
  ]);

  return (
    <>
      <h1>{post.title}</h1>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <pre>{JSON.stringify(postSections, null, 2)}</pre>
    </>
  );
}
