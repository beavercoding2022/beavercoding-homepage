import { Database } from '@/src/types_db';

export type PostingType =
  Database['public']['Tables']['posts']['Row']['posting_type'];

function getPath(postingType: PostingType) {
  switch (postingType) {
    case 'blog':
      return '/b';
    case 'docs':
      return '/d';
    case 'portfolio':
      return '/portfolio';
    default:
      return '/';
  }
}

export default function pathMapper(postingType: PostingType, slug?: string) {
  return `${getPath(postingType)}/${slug ?? ''}`;
}
