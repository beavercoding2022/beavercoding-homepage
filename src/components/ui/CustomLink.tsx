import { Database } from '@/src/types_db';
import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

type Post = Database['public']['Tables']['posts']['Row'];

// if 'href' is given, post is not needed; else, 'href' is not needed.
type CustomLinkProps = { href?: string } & Omit<LinkProps, 'href'> & {
    post?: Post;
  };

type PostingType = NonNullable<Post['posting_type']>;

const PATH_MAPPER: Record<PostingType, 'b' | 'portfolio' | 'd'> = {
  blog: 'b',
  portfolio: 'portfolio',
  docs: 'd',
};

export default function CustomLink({
  post,
  ...props
}: PropsWithChildren<CustomLinkProps>) {
  const classNames =
    'inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-zinc-200 rounded-md p-1 hover:text-zinc-100 focus:outline-none focus:text-zinc-100 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50';

  if (props.href) {
    return (
      <Link {...props} href={props.href} className={classNames}>
        {props.children}
      </Link>
    );
  }

  return (
    <Link
      {...props}
      href={`/${PATH_MAPPER[post?.posting_type || 'blog']}/${post?.slug}`}
      className={classNames}
    >
      {props.children}
    </Link>
  );
}
