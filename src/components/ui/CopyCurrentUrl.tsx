'use client';

import CopyText from '@/src/components/ui/CopyText';

export default function CopyCurrentUrl() {
  if (typeof window === 'undefined') {
    return null;
  }
  return <CopyText text={window.location.href} />;
}
