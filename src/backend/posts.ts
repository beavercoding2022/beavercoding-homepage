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
    .select('*, categories!post_categories (*)')
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
  postingType?: NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >,
) {
  const supabase = createServerSupabaseClient();
  const query = supabase
    .from('categories')
    .select(
      `*,
      posts!post_categories!inner (
        *,
        categories!post_categories!inner (*)
      )
    `,
    )
    .eq('slug', categorySlug)
    .order('created_at', { referencedTable: 'posts', ascending: false });

  const { data, error } = postingType
    ? await query.eq('posts.posting_type', postingType)
    : await query;

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
  postingType?: Database['public']['Tables']['posts']['Row']['posting_type'],
) {
  const supabase = createServerSupabaseClient();

  const baseQuery = supabase
    .from('categories')
    .select('*, posts!post_categories!inner (id, posting_type)');
  const query = postingType
    ? baseQuery.eq('posts.posting_type', postingType)
    : baseQuery;

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const result = data.map((cat) => ({
    ...cat,
    posts: cat.posts.reduce(
      (acc, cur) => {
        if (!cur.posting_type) {
          return {
            ...acc,
            'n/a': acc['n/a'] + 1,
          };
        }

        return {
          ...acc,
          [cur.posting_type]: acc[cur.posting_type] + 1,
        };
      },
      {
        blog: 0,
        portfolio: 0,
        docs: 0,
        'n/a': 0,
      },
    ),
  }));

  return result;
}
