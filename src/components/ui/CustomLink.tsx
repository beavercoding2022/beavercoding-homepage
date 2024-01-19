import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

export default function CustomLink(props: PropsWithChildren<LinkProps>) {
  return (
    <Link
      {...props}
      className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-zinc-200 rounded-md p-1 hover:text-zinc-100 focus:outline-none focus:text-zinc-100 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
    >
      {props.children}
    </Link>
  );
}
