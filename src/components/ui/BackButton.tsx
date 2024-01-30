'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton() {
  const { back } = useRouter();
  const handleClickBack = React.useCallback(() => back(), [back]);
  return (
    <Button variant={'outline'} onClick={handleClickBack}>
      {'< Back'}
    </Button>
  );
}
