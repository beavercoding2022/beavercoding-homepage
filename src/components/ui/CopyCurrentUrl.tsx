'use client';

import CopyText from '@/src/components/ui/CopyText';

export default function CopyCurrentUrl() {
  return <CopyText text={window.location.href} />;
}
