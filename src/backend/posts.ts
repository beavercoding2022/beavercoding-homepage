import { createServerSupabaseClient } from '@/src/backend/instance';
import { Database } from '@/src/types_db';
import { QueryData } from '@supabase/supabase-js';

export async function getPosts() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('posts').select('*');
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
    .select('*')
    .eq('slug', slug)
    .eq('posting_type', postingType)
    .single();

  return data;
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
