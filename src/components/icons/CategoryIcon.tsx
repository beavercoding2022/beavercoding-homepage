import { Database } from '@/src/types_db';
import Image from 'next/image';

export type CategoryIconProps =
  Database['public']['Tables']['categories']['Row'] & { size?: number };

export default function CategoryIcon({
  name,
  slug,
  thumbnail_url,
  size,
}: CategoryIconProps) {
  if (!thumbnail_url) {
    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/category/fallback.svg`}
        width={size || 30}
        height={size || 30}
        alt={name}
        priority={false}
        unoptimized
        className="m-0"
      />
    );
  }

  return (
    <Image
      src={thumbnail_url}
      width={size || 30}
      height={size || 30}
      alt={name}
      priority={false}
      unoptimized
      className="m-0"
    />
  );
}
