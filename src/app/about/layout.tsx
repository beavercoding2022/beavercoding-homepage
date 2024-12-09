import { Metadata } from 'next';
import { getURL } from 'next/dist/shared/lib/utils';
import { PropsWithChildren } from 'react';

export default async function AboutLayout(props: PropsWithChildren) {
  return (
    <article className="mx-auto px-4 sm:px-6 lg:px-8">{props.children}</article>
  );
}
