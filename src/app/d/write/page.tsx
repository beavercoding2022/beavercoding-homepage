import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import React from 'react';

const markdown = `
# Edit Here!

1. Edit here

2. Edit here

3. Edit here
`;

export default function WriteDoc() {
  return (
    <div>
      <h1>Write Doc</h1>
      <p>Write Doc</p>
      <React.Suspense fallback={null}>
        <ForwardRefEditor markdown={markdown} />
      </React.Suspense>
    </div>
  );
}
