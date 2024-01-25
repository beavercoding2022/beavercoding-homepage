import { createServerSupabaseClient } from '@/src/app/supabase-server';
import { Database } from '@/src/types_db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const postingType = (searchParams.get('posting-type') ||
    'blog') as NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >;
  const page = Number.parseInt(searchParams.get('page') || '0', 10);

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('posting_type', postingType)
    .order('created_at', { ascending: false })
    .range(page * 10, page * 10 + 9);

  if (error) {
    throw error;
  }

  return NextResponse.json({
    posts: data,
  });
}
