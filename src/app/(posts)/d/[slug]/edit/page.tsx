import { getUser } from '@/src/app/supabase-server';
import { getFullPost } from '@/src/backend/posts';
import pathMapper from '@/src/utils/pathMapper';
import { revalidatePath } from 'next/cache';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

const Writer = dynamic(() => import('@/src/components/Writer/Writer'), {
  ssr: false,
});

export default async function EditDocumentPost({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  revalidatePath(`${pathMapper('docs', decodedSlug)}/edit`);

  try {
    const user = await getUser();

    // TODO: Add a check for the user's role instead of checking ID
    if (user?.id !== 'e979672e-8d67-447b-9abc-ef13bbfe588d') {
      redirect('/');
    }
    const [post] = await Promise.all([getFullPost(decodedSlug, 'docs')]);

    if (!post) {
      notFound();
    }

    return <Writer posting_type={'blog'} post={post} />;
  } catch (error) {
    notFound();
  }
}
