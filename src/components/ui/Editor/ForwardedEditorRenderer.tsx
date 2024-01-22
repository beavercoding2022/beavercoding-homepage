'use client';

import { EditorProps } from '@/src/components/ui/Editor/Editor';
import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import React from 'react';

// ForwardRefEditor.tsx

// This is the only place InitializedMDXEditor is imported directly.
const EditorRenderer = dynamic(() => import('./EditorRenderer'), {
  // Make sure we turn SSR off
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditorRenderer = React.forwardRef<
  MDXEditorMethods,
  Omit<EditorProps, 'editorRef'>
>((props, ref) => <EditorRenderer {...props} editorRef={ref} />);

// TS complains without the following line
ForwardRefEditorRenderer.displayName = 'ForwardRefEditorRenderer';
