'use client';

import {
  AdmonitionDirectiveDescriptor,
  BoldItalicUnderlineToggles,
  CodeToggle,
  KitchenSinkToolbar,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import React from 'react';
interface EditorProps {
  markdown: string;
  editorRef: React.Ref<MDXEditorMethods>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
export default function Editor({
  markdown,
  editorRef,
}: React.PropsWithChildren<EditorProps>) {
  return (
    <div className="w-full h-[80vh] max-h-80vh mt-2">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        contentEditableClassName="prose dark:prose-invert"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-row">
                {' '}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
              </div>
            ),
          }),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),

          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              css: 'CSS',
              txt: 'text',
              tsx: 'TypeScript',
            },
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  );
}
