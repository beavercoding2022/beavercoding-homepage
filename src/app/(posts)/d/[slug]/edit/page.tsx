import { getUser } from '@/src/app/supabase-server';
import { getFullPost } from '@/src/backend/posts';
import WriterWrapper from '@/src/components/Writer/WriterWrapper';
import pathMapper from '@/src/utils/pathMapper';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

export default async function EditDocumentPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
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

    return <WriterWrapper posting_type={'blog'} post={post} />;
  } catch (error) {
    notFound();
  }
}
