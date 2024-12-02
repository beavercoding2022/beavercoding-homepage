'use client';

import dynamic from 'next/dynamic';
import { UseWriterProps } from './useWriter';
import SupabaseProvider from '@/src/app/supabase-provider';

const Writer = dynamic(() => import('@/src/components/Writer/Writer'), {
  ssr: false,
});

export default function WriterWrapper(props: UseWriterProps) {
  return (
    <SupabaseProvider>
      <Writer {...props} />
    </SupabaseProvider>
  );
}
