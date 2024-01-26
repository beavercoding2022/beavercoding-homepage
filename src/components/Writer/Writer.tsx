'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Section from '@/src/components/Writer/Section';
import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import { Database } from '@/src/types_db';
import sluggify from '@/src/utils/sluggify';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { Label } from '@radix-ui/react-label';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export type WriterProps = {
  postingType: Database['public']['Tables']['posts']['Row']['posting_type'];
};

const initialModalstate: { isOpen: boolean; message: string } = {
  isOpen: false,
  message: 'Default Modal',
};

const initialMarkdown = `* Hello World`;

export default function Writer({
  postingType,
}: React.PropsWithChildren<WriterProps>) {
  const { push } = useRouter();
  const [supabase] = React.useState(() => createPagesBrowserClient());
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const [title, setTitle] = React.useState<string>('');
  const [modal, setModal] = React.useState<{
    isOpen: boolean;
    message: string;
  }>(initialModalstate);

  const [writingSection, setWritingSection] = React.useState<{
    markdownSections: string[];
    currentIndex: number;
  }>(() => ({
    markdownSections: [initialMarkdown],
    currentIndex: 0,
  }));

  const [imagePaths, setImagePathes] = React.useState<string[]>([]);

  const id = React.useMemo(() => uuidv4().slice(0, 8), []);

  const slug = React.useMemo(() => {
    return `${sluggify(title)}-${id}`;
  }, [id, title]);

  const handleUpload = React.useCallback(
    async function (image: File): Promise<string> {
      const { data, error } = await supabase.storage
        .from('imagesasdf')
        .upload(`${postingType}/${slug}/${image.name}`, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        setModal({
          isOpen: true,
          message: error.message,
        });
        throw error;
      }

      const {
        data: { publicUrl: newPublicUrl },
      } = supabase.storage.from('images').getPublicUrl(data?.path);

      setImagePathes((prev) => [...prev, newPublicUrl]);

      return newPublicUrl;
    },
    [postingType, slug, supabase.storage],
  );

  const onChangeMarkdown = React.useCallback((markdown: string) => {
    setWritingSection((prev) => ({
      ...prev,
      markdownSections: [
        ...prev.markdownSections.slice(0, prev.currentIndex),
        markdown,
        ...prev.markdownSections.slice(prev.currentIndex + 1),
      ],
    }));
  }, []);

  const handleCloseModal = React.useCallback(
    (open = false) => setModal((prev) => ({ ...prev, isOpen: open })),
    [],
  );

  const onClickPlus = React.useCallback(() => {
    setWritingSection((prev) => {
      if (prev.markdownSections[prev.currentIndex] === '') {
        return prev;
      }

      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        markdownSections: [...prev.markdownSections, ''],
      };
    });
    editorRef.current?.setMarkdown('');
  }, []);

  const onClickSave = React.useCallback(async () => {
    if (title === '') {
      setModal({
        isOpen: true,
        message: 'The title is empty',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .insert<Database['public']['Tables']['posts']['Insert']>([
          {
            title,
            slug,
            posting_type: postingType,
            public: true,
          },
        ]);

      if (error) {
        throw { ...error, cause: 'insert posts' };
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (postError) {
        throw { ...postError, cause: 'select posts' };
      }

      const postId = postData.id;

      const { error: postSectionsError } = await supabase
        .from('post_sections')
        .insert<Database['public']['Tables']['post_sections']['Insert']>(
          writingSection.markdownSections.map((markdownSection, index) => ({
            post_id: postId,
            content: markdownSection,
            section_order: index,
          })),
        );

      if (postSectionsError) {
        throw { ...postSectionsError, cause: 'insert post_sections' };
      }

      push(`/posts/${slug}`);
    } catch (error) {
      console.log(error);
      setModal({
        isOpen: true,
        message: (error as Error)?.message,
      });
    }
  }, [
    postingType,
    push,
    slug,
    supabase,
    title,
    writingSection.markdownSections,
  ]);

  return (
    <>
      <div className="my-2">
        <div className="w-full items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <p>slug: {slug}</p>
        <div className="w-full items-center gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input type="text" id="category" value={title} readOnly />
        </div>
        <div className="flex md:flex-row flex-col">
          <section className="flex flex-1 py-2 mr-1">
            <ForwardRefEditor
              ref={editorRef}
              markdown={
                writingSection.markdownSections[writingSection.currentIndex]
              }
              onChange={onChangeMarkdown}
              handleUpload={handleUpload}
              imageAutocompleteSuggestions={imagePaths}
            />
          </section>
          <section className="flex flex-1 flex-col py-2 ml-1">
            {writingSection.markdownSections.map((markdownSection, index) => (
              <Section key={`index_${index}`} markdown={markdownSection} />
            ))}
            <Button variant={'outline'} onClick={onClickPlus}>
              +
            </Button>
          </section>
        </div>
        <Button variant={'outline'} onClick={onClickSave}>
          Save Changes
        </Button>
      </div>

      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Error Has occurred</DialogDescription>
          </DialogHeader>
          <p>{modal.message}</p>
          <DialogFooter>
            <Button
              variant={'outline'}
              onClick={(event) => {
                event.stopPropagation();
                handleCloseModal();
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
