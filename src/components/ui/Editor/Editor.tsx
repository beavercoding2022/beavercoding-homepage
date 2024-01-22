'use client';

import {
  AdmonitionDirectiveDescriptor,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  Separator,
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
import styles from './Editor.module.css';

export type EditorProps = MDXEditorProps & {
  markdown: string;
  editorRef: React.Ref<MDXEditorMethods>;
  handleUpload?: (image: File) => Promise<string>;
  imageAutocompleteSuggestions?: string[];
};

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
export default function Editor({
  markdown,
  editorRef,
  handleUpload,
  imageAutocompleteSuggestions,
  ...props
}: React.PropsWithChildren<EditorProps>) {
  return (
    <>
      <div className="w-full mt-2 border-2 dark:border-2 flex flex-1 flex-row h-[60vh]">
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          className={[
            'prose',
            'dark:prose-invert',
            'dark-theme',
            'dark-editor',
            'flex-1',
            'min-w-full',
            'overflow-y-scroll',
          ].join(' ')}
          contentEditableClassName="prose dark:prose min-w-full"
          plugins={[
            imagePlugin({
              imageAutocompleteSuggestions,
              imageUploadHandler: handleUpload,
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <div
                  className={['flex', 'flex-row', styles.childWrap].join(' ')}
                >
                  <DiffSourceToggleWrapper>
                    <ConditionalContents
                      options={[
                        {
                          fallback: () => (
                            <>
                              <UndoRedo />
                              <Separator />
                              <BoldItalicUnderlineToggles />
                              <CodeToggle />
                              <Separator />
                              <ListsToggle />
                              <Separator />
                              <CreateLink />
                              <InsertImage />
                              <Separator />
                              <InsertTable />
                              <InsertThematicBreak />
                              <Separator />
                              <InsertCodeBlock />
                              <Separator />
                              <InsertFrontmatter />
                            </>
                          ),
                        },
                        {
                          when: (editor) => editor?.editorType === 'codeblock',
                          contents: () => <ChangeCodeMirrorLanguage />,
                        },
                      ]}
                    />
                  </DiffSourceToggleWrapper>
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
            diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
            markdownShortcutPlugin(),
          ]}
          {...props}
        />
      </div>
    </>
  );
}
