'use client';

import CopyText from '@/src/components/ui/CopyText';
import React from 'react';

export default function CopyCurrentUrl() {
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return <CopyText text={url} />;
}
