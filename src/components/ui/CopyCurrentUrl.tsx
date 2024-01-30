'use client';

import CopyText from '@/src/components/ui/CopyText';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function CopyCurrentUrl() {
  const [url, setUrl] = React.useState('');
  const pathname = usePathname();

  React.useEffect(() => {
    setUrl(decodeURIComponent(window.location.href));
  }, [pathname]);

  return <CopyText text={url} />;
}
