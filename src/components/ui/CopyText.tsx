'use client';

import Copy from '@/src/components/icons/Copy';
import { PropsWithChildren } from 'react';
import { useToast } from '@/components/ui/use-toast';

type CopyTextProps = {
  text: string;
};

export default function CopyText(props: PropsWithChildren<CopyTextProps>) {
  const { toast } = useToast();

  return (
    <div
      className="flex flex-row items-center cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.text);
        toast({
          title: 'Text Copied on your clipboard!',
        });
      }}
    >
      <Copy />
      <p className="mx-1" />
      <span>{props.text}</span>
    </div>
  );
}
