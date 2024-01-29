import { getPost } from '@/src/backend/posts';
import { notFound } from 'next/navigation';

export default async function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getPost(params.slug, 'docs');
    return (
      <div>
        <h1>Doc Page</h1>
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
