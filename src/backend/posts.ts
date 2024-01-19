import { Database } from '@/src/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies }),
);

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
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function getPostSectionsBySlug(
  slug: Database['public']['Tables']['posts']['Row']['slug'],
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('post_sections')
    .select(
      `
  *,
  posts ( id, slug )
`,
    )
    .eq('posts.slug', slug);
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
