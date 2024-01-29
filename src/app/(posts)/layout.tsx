import { PropsWithChildren } from 'react';

type PostsLayoutProps = {
  params:
    | {
        slug: string;
      }
    | {
        slug: string[];
      }
    | {
        category: string;
      };
};

export default function PostsLayout(
  props: PropsWithChildren<PostsLayoutProps>,
) {
  return <>{props.children}</>;
}
