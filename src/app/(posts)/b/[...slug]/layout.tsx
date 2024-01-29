import { PropsWithChildren } from 'react';

export default function BlogLayout(props: PropsWithChildren) {
  return <div>{props.children}</div>;
}
