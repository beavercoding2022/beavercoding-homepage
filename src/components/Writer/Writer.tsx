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
import WritingSection from '@/src/components/Writer/Section';
import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import { Database } from '@/src/types_db';
import sluggify from '@/src/utils/sluggify';
import { MDXEditorMethods } from '@mdxeditor/editor';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
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

type WritingSection = {
  markdownSections: {
    markdown: string;
    externalReference: string | null;
    internalReferencePostSectionId: string | null;
  }[];
  currentIndex: number;
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

const initialWritingSection: WritingSection = {
  markdownSections: [
    {
      markdown: initialMarkdown,
      externalReference: null,
      internalReferencePostSectionId: null,
    },
  ],
  currentIndex: 0,
};

export default function Writer({
  postingType,
}: React.PropsWithChildren<WriterProps>) {
  const { push } = useRouter();
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [supabase] = React.useState(() => createPagesBrowserClient<Database>());

  const [loading, setLoading] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  const [category, setCategory] =
    React.useState<CategoryState>(initialCategoryState);
  const [modal, setModal] = React.useState<{
    isOpen: boolean;
    message: string;
  }>(initialModalstate);

  const [writingSection, setWritingSection] = React.useState<WritingSection>(
    initialWritingSection,
  );

  const [imagePaths, setImagePathes] = React.useState<string[]>([]);

  const id = React.useMemo(() => uuidv4().slice(0, 8), []);

  const slug = React.useMemo(() => {
    return `${sluggify(title)}-${id}`;
  }, [id, title]);

  const handleUpload = React.useCallback(
    async function (image: File): Promise<string> {
      if (title === '') {
        setModal({
          isOpen: true,
          message: 'The title is empty',
        });
        throw new Error('The title is empty');
      }

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
    [postingType, slug, supabase.storage, title],
  );

  const onChangeMarkdown = React.useCallback((markdown: string) => {
    setWritingSection((prev) => ({
      ...prev,
      markdownSections: [
        ...prev.markdownSections.slice(0, prev.currentIndex),
        {
          ...prev.markdownSections[prev.currentIndex],
          markdown,
        },
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
      if (prev.markdownSections[prev.currentIndex].markdown === '') {
        return prev;
      }

      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        markdownSections: [
          ...prev.markdownSections,
          initialWritingSection.markdownSections[0],
        ],
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

    setLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert<Database['public']['Tables']['posts']['Insert']>([
          {
            title,
            slug,
            posting_type: postingType,
            public: true,
            thumbnail_url: thumbnail,
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
            content: markdownSection.markdown,
            external_reference_url: markdownSection.externalReference,
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
    } finally {
      setLoading(false);
    }
  }, [
    category.selectedCategories,
    postingType,
    push,
    slug,
    supabase,
    thumbnail,
    title,
    writingSection.markdownSections,
  ]);

  const handleClickEditSection = React.useCallback(
    (
      markdownSection: WritingSection['markdownSections'][number],
      index: number,
    ) =>
      () => {
        setWritingSection((prev) => ({
          ...prev,
          currentIndex: index,
        }));
        editorRef.current?.setMarkdown(markdownSection.markdown);
      },
    [],
  );

  const handleClickDeleteSection = React.useCallback(
    (targetIndex: number) => () => {
      setWritingSection((prev) => {
        if (prev.currentIndex === targetIndex && prev.currentIndex > 0) {
          editorRef.current?.setMarkdown(
            prev.markdownSections[targetIndex - 1].markdown,
          );
          return {
            ...prev,
            markdownSections: [
              ...prev.markdownSections.slice(0, targetIndex),
              ...prev.markdownSections.slice(targetIndex + 1),
            ],
            currentIndex: targetIndex - 1,
          };
        }

        if (prev.currentIndex === targetIndex && prev.currentIndex === 0) {
          editorRef.current?.setMarkdown('');
          return {
            ...prev,
            markdownSections: [
              ...prev.markdownSections.slice(1),
              ...prev.markdownSections.slice(targetIndex + 1),
            ],
            currentIndex: 0,
          };
        }

        if (prev.currentIndex > targetIndex) {
          return {
            ...prev,
            currentIndex: prev.currentIndex - 1,
            markdownSections: [
              ...prev.markdownSections.slice(0, targetIndex),
              ...prev.markdownSections.slice(targetIndex + 1),
            ],
          };
        }

        return {
          ...prev,
          markdownSections: [
            ...prev.markdownSections.slice(0, targetIndex),
            ...prev.markdownSections.slice(targetIndex + 1),
          ],
        };
      });
    },
    [],
  );

  const handleClickModalClose: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(
      (event) => {
        event.stopPropagation();
        handleCloseModal();
      },
      [handleCloseModal],
    );

  const handleUploadThumbnail: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      async (e) => {
        if (title === '') {
          setModal({
            isOpen: true,
            message: 'The title is empty',
          });
          setThumbnail(null);
          if (fileRef.current) {
            fileRef.current.value = '';
          }
          return;
        }

        const file = e.target.files?.item(0);
        if (!file) {
          setModal({
            isOpen: true,
            message: 'File is not selected',
          });
          return;
        }

        const thumbnailUrl = await handleUpload(file);

        setThumbnail(thumbnailUrl);
      },
      [handleUpload, title],
    );

  if (loading) {
    return <p>Loading...</p>;
  }

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

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            onChange={handleUploadThumbnail}
            ref={fileRef}
          />
          {thumbnail && (
            <Image src={thumbnail} alt="thumbnail" width={200} height={200} />
          )}
        </div>
        <CategorySelector state={category} setState={setCategory} />
        <div className="flex md:flex-row flex-col min-h-[500px]">
          <section className="flex flex-col flex-1 py-2 mr-1">
            <Label>Markdown</Label>

            <ForwardRefEditor
              ref={editorRef}
              markdown={
                writingSection.markdownSections[writingSection.currentIndex]
                  ?.markdown || ''
              }
              onChange={onChangeMarkdown}
              handleUpload={handleUpload}
              imageAutocompleteSuggestions={imagePaths}
            />
            <Label className="my-2" htmlFor="external_reference_url">
              External Reference URL
            </Label>
            <Input
              type="text"
              id="external_reference_url"
              value={
                writingSection.markdownSections[writingSection.currentIndex]
                  .externalReference || ''
              }
              onChange={(event) => {
                setWritingSection((prev) => ({
                  ...prev,
                  markdownSections: [
                    ...prev.markdownSections.slice(0, prev.currentIndex),
                    {
                      ...prev.markdownSections[prev.currentIndex],
                      externalReference: event.target.value,
                    },
                    ...prev.markdownSections.slice(prev.currentIndex + 1),
                  ],
                }));
              }}
            />
          </section>
          <section className="flex flex-1 flex-col py-2 ml-1">
            <Label>Preview</Label>
            {writingSection.markdownSections.map((markdownSection, index) => (
              <React.Fragment key={`writing_section_index_${index}`}>
                <WritingSection
                  markdown={markdownSection.markdown}
                  length={writingSection.markdownSections.length}
                  currentIndex={writingSection.currentIndex}
                  renderingIndex={index}
                  onClickEdit={handleClickEditSection(markdownSection, index)}
                  onClickDelete={handleClickDeleteSection(index)}
                  externalReference={markdownSection.externalReference}
                />
              </React.Fragment>
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
            <Button variant={'outline'} onClick={handleClickModalClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
