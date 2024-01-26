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
import { Label } from '@/components/ui/label';
import CategorySelector from '@/src/components/Writer/CategorySelector';
import Section from '@/src/components/Writer/Section';
import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import { Database } from '@/src/types_db';
import sluggify from '@/src/utils/sluggify';
import { MDXEditorMethods } from '@mdxeditor/editor';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

type PostingType = NonNullable<
  Database['public']['Tables']['posts']['Row']['posting_type']
>;
const PATH_MAPPER: Record<PostingType, 'b' | 'portfolio' | 'd'> = {
  blog: 'b',
  portfolio: 'portfolio',
  docs: 'd',
};

type Category = Database['public']['Tables']['categories']['Row'];

export type CategoryState = {
  inputCategory: string;
  hasToBeCreated: boolean;
  searchedCategories: Category[];
  selectedCategories: Category[];
};

export type WriterProps = {
  postingType: PostingType;
};

const initialModalstate: { isOpen: boolean; message: string } = {
  isOpen: false,
  message: 'Default Modal',
};

const initialMarkdown = `* Hello World`;

const initialCategoryState: CategoryState = {
  inputCategory: '',
  hasToBeCreated: false,
  searchedCategories: [],
  selectedCategories: [],
};

export default function Writer({
  postingType,
}: React.PropsWithChildren<WriterProps>) {
  const { push } = useRouter();
  const [supabase] = React.useState(() => createPagesBrowserClient<Database>());
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const [title, setTitle] = React.useState<string>('');

  const [category, setCategory] =
    React.useState<CategoryState>(initialCategoryState);
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
        .from('images')
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

      const { error: postCategoryError } = await supabase
        .from('post_categories')
        .insert(
          category.selectedCategories.map((category) => ({
            post_id: postData.id,
            category_id: category.id,
          })),
        );

      if (postCategoryError) {
        throw { ...postCategoryError, cause: 'insert post_categories' };
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

      const { data: postSectionsData, error: postSectionsSelectError } =
        await supabase.from('post_sections').select('id').eq('post_id', postId);

      if (postSectionsSelectError) {
        throw { ...postSectionsSelectError, cause: 'select post_sections' };
      }

      const { error: postSectionCategoryError } = await supabase
        .from('post_section_categories')
        .insert(
          postSectionsData
            .map((postSection) =>
              category.selectedCategories.map((category) => ({
                post_section_id: postSection.id,
                category_id: category.id,
              })),
            )
            .flat(),
        );

      if (postSectionCategoryError) {
        throw {
          ...postSectionCategoryError,
          cause: 'insert post_section_categories',
        };
      }

      push(`/${PATH_MAPPER[postingType]}/${slug}`);
    } catch (error) {
      console.log(error);
      setModal({
        isOpen: true,
        message: (error as Error)?.message,
      });
    }
  }, [
    category.selectedCategories,
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
        <CategorySelector state={category} setState={setCategory} />
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
              <Section
                key={`index_${index}`}
                markdown={markdownSection}
                current={writingSection.currentIndex === index}
                onClickEdit={() => {
                  setWritingSection((prev) => ({
                    ...prev,
                    currentIndex: index,
                  }));
                  editorRef.current?.setMarkdown(markdownSection);
                }}
              />
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
