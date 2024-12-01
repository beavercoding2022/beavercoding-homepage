'use client';

import dynamic from 'next/dynamic';
import { UseWriterProps } from './useWriter';

const Writer = dynamic(() => import('@/src/components/Writer/Writer'), {
  ssr: false,
});

export default function WriterWrapper(props: UseWriterProps) {
  return <Writer {...props} />;
}
