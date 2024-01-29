import { createServerSupabaseClient } from '@/src/backend/instance';
import { Database } from '@/src/types_db';

export async function getPosts(
  type: NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >,
  { page, pageSize }: { page: number; pageSize: number } = {
    page: 1,
    pageSize: 10,
  },
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select(
      `*, 
      categories!post_categories (*), 
      post_sections!inner (id, content)
      `,
    )
    .eq('posting_type', type)
    .order('created_at', { ascending: false })
    .range(page * pageSize - pageSize, page * pageSize - 1);
  if (error) {
    throw error;
  }
  return data;
}

export async function getPost(
  slug: Database['public']['Tables']['posts']['Row']['slug'],
  postingType: NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >,
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, categories!post_categories (id, name, slug)')
    .eq('slug', slug)
    .eq('posting_type', postingType)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPostsByCategory(
  categorySlug: Database['public']['Tables']['categories']['Row']['slug'],
  postingType: NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >,
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select(
      `*,
      posts!post_categories!inner (
        *,
        categories!post_categories!inner (*)
      )
    `,
    )
    .eq('posts.posting_type', postingType)
    .eq('slug', categorySlug)
    .order('created_at', { referencedTable: 'posts', ascending: false });

  if (error) {
    throw error;
  }

  return data.map((v) => v.posts).flatMap((v) => v);
}

export async function getPostSectionsBySlug(
  slug: Database['public']['Tables']['posts']['Row']['slug'],
) {
  const supabase = createServerSupabaseClient();
  const getDataQuery = supabase
    .from('post_sections')
    .select(`*, posts!inner(*)`)
    .eq('posts.slug', slug);

  const { data, error } = await getDataQuery;

  if (error) {
    throw error;
  }
  return data;
}

export async function getPostSections(
  postId: Database['public']['Tables']['posts']['Row']['id'],
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('post_sections')
    .select('*')
    .eq('post_id', postId);
  if (error) {
    throw error;
  }
  return data;
}

export async function getValidCategories(
  postingType: Database['public']['Tables']['posts']['Row']['posting_type'],
) {
  const supabase = createServerSupabaseClient();
  const query = postingType
    ? supabase
        .from('categories')
        .select('*, posts!post_categories!inner (*)')
        .eq('posts.posting_type', postingType)
    : supabase.from('categories').select('*, posts!post_categories!inner (*)');

  const { data, error } = await query;

  if (error) {
    throw error;
  }
  return data;
}
