import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import React from 'react';

export default function EditorRenderer(
  props: React.PropsWithChildren<
    MDXEditorProps & {
      editorRef: React.Ref<MDXEditorMethods>;
    }
  >,
) {
  return (
    <MDXEditor
      ref={props.editorRef}
      className={[
        'prose',
        'dark:prose-invert',
        'dark-theme',
        'dark-editor',
        'flex-1',
        'min-w-full',
        'overflow-y-scroll',
      ].join(' ')}
      plugins={[
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
            ts: 'TypeScript',
            css: 'CSS',
            txt: 'text',
            sql: 'SQL',
            tsx: 'TypeScript React',
            jsx: 'React',
          },
        }),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        markdownShortcutPlugin(),
      ]}
      readOnly
      {...props}
    />
  );
}
