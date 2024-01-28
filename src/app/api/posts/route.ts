import { createServerSupabaseClient } from '@/src/app/supabase-server';
import { getPosts } from '@/src/backend/posts';
import { Database } from '@/src/types_db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = {
    'posting-type': searchParams.get('posting-type'),
    page: searchParams.get('page'),
    pageSize: searchParams.get('pageSize'),
  };

  console.log(query);

  const postingType = (query['posting-type'] || 'blog') as NonNullable<
    Database['public']['Tables']['posts']['Row']['posting_type']
  >;
  const page = Number.parseInt(query.page || '0', 10);
  const pageSize = Number.parseInt(query.pageSize || '0', 10);

  const data = await getPosts(postingType, { page, pageSize });

  return NextResponse.json({
    posts: data,
  });
}
