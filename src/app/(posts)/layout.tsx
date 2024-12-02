import CopyCurrentUrl from '@/src/components/ui/CopyCurrentUrl';
import { PropsWithChildren } from 'react';

export default function PostsLayout(props: PropsWithChildren) {
  return (
    <>
      <div className="flex flex-row text-slate-500">
        <CopyCurrentUrl />
      </div>
      {props.children}
    </>
  );
}
