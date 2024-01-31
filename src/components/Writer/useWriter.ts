import { getFullPost } from '@/src/backend/posts';
import { Database } from '@/src/types_db';
import React from 'react';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { EditorProps } from '@/src/components/ui/Editor/Editor';
import pathMapper from '@/src/utils/pathMapper';
import {
  Post,
  PostingType,
  createUseWriterInitialState,
  initialModalstate,
  useWriterSliceCreatorFn,
} from '@/src/components/Writer/useWriter.slice';

export type UseWriterProps = {
  posting_type: NonNullable<PostingType>;
  post?: Post;
};

export type UseWriterReturn = ReturnType<typeof useWriter>;

export default function useWriter(props: UseWriterProps) {
  const { push } = useRouter();
  const id = React.useMemo(() => uuidv4().slice(0, 8), []);
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [supabase] = React.useState(() => createPagesBrowserClient<Database>());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [modal, setModal] = React.useState<{
    isOpen: boolean;
    message: string;
  }>(initialModalstate);

  const slice = useWriterSliceCreatorFn(props);

  const [state, dispatch] = React.useReducer(
    slice.reducer,
    createUseWriterInitialState(props),
  );

  React.useEffect(() => {
    // TODO: Fix this not using useEffect; use else
    const input =
      state.post_sections_state.post_sections[
        state.post_sections_state.current_index
      ].category_state.input;

    if (input.length === 0) {
      supabase
        .from('categories')
        .select('*')
        .then(({ data }) => {
          dispatch(slice.actions.setCategoriesSearched(data || []));
        });
    }

    if (input.length > 0) {
      supabase
        .from('categories')
        .select('*')
        .ilike('name', `%${input}%`)
        .then(({ data }) => {
          dispatch(slice.actions.setCategoriesSearched(data || []));
        });
    }
  }, [
    slice.actions,
    state.post_sections_state.current_index,
    state.post_sections_state.post_sections,
    supabase,
  ]);

  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        dispatch(
          slice.actions.setTitle({
            title: e.target.value,
            uuid: id,
          }),
        );
      },
      [id, slice.actions],
    );

  const handleClickModalClose: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(() => {
      setModal(initialModalstate);
    }, []);

  const handleUploadImage = React.useCallback(
    async (image: File) => {
      setIsLoading(true);
      if (state.title === '') {
        setModal({
          isOpen: true,
          message: 'The title is empty',
        });
        throw new Error('The title is empty');
      }

      const { data, error } = await supabase.storage
        .from('images')
        .upload(`${props.posting_type}/${state.slug}/${image.name}`, image, {
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

      if (!newPublicUrl) {
        setModal({
          isOpen: true,
          message: 'The image path is empty',
        });
        throw new Error('The image path is empty');
      }

      return newPublicUrl;
    },
    [props.posting_type, state.slug, state.title, supabase.storage],
  );

  const handleUploadThumbnail: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      async (e) => {
        if (!e.target.files) return;
        if (state.title === '') {
          setModal({
            isOpen: true,
            message: 'The title is empty',
          });
          dispatch(slice.actions.removeThumbnail());
          return;
        }

        const file = e.target.files[0];
        if (!file) {
          setModal({
            isOpen: true,
            message: 'The file is not selected',
          });
          return;
        }

        const thumbnailUrl = await handleUploadImage(file);

        dispatch(slice.actions.setThumbnail(thumbnailUrl));
      },
      [handleUploadImage, slice.actions, state.title],
    );

  const handleChangeMarkdown: EditorProps['onChange'] = React.useCallback(
    (markdown: string) => {
      dispatch(
        slice.actions.updateCurrentSectionContent({
          content: markdown,
          index: state.post_sections_state.current_index,
        }),
      );
    },
    [slice.actions, state.post_sections_state.current_index],
  );

  const handleClickPlusButton = React.useCallback(() => {
    dispatch(slice.actions.addNewSection());
  }, [slice.actions]);

  const handleChangeCategoryInput: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        dispatch(
          slice.actions.setCategoryInput({
            input: e.target.value,
          }),
        );
      },
      [slice.actions],
    );

  const handleClickCategoryToggle: (
    index: number,
  ) => React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (index: number) => (e) => {
      dispatch(slice.actions.toggleCategorySelected({ index }));
    },
    [slice.actions],
  );

  const handleChangeExternalReferenceUrl: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        dispatch(
          slice.actions.updateCurrentSectionExternalReferenceUrl({
            url: e.target.value,
          }),
        );
      },
      [slice.actions],
    );

  const handleClickEditSectionButton: (
    index: number,
  ) => React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (index: number) => (e) => {
      dispatch(slice.actions.setCurrentSectionEdit({ index }));
    },
    [slice.actions],
  );

  const handleClickDeleteSectionButton: (
    index: number,
  ) => React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (index: number) => (e) => {
      dispatch(slice.actions.deleteSection({ index }));
    },
    [slice.actions],
  );

  const handleSave = React.useCallback(async () => {
    // 이걸 useMemo로 빼는것도 고려해 볼 것. 왜냐면 업로드 하기 전에 보이는 postSection이 요거임.
    const sectionsWithSelectedCategories =
      state.post_sections_state.post_sections
        .filter((section) => section.mode !== 'delete')
        .map((section, sectionIndex) => ({
          ...section,
          section_order: sectionIndex,
          categories: section.category_state.searched
            .filter((category) => category.isSelected)
            .map((category) => ({
              id: category.id!, // id is not null
            })),
        }));

    const { data: postData, error } = await supabase
      .from('posts')
      .insert({
        title: state.title,
        slug: state.slug,
        thumbnail_url: state.thumbnail_url,
        posting_type: state.posting_type,
        image_paths: state.image_paths,
        public: true,
      })
      .select()
      .single();

    if (error) {
      throw { ...error, cause: 'insert post' };
    }

    const postCategories = sectionsWithSelectedCategories
      .map((section) => section.categories.filter((category) => category.id))
      .flatMap((categories) =>
        categories.map((category) => ({
          post_id: postData.id,
          category_id: category.id,
        })),
      );

    const { error: postCategoriesError } = await supabase
      .from('post_categories')
      .insert(postCategories);

    if (postCategoriesError) {
      throw { ...postCategoriesError, cause: 'insert post_categories' };
    }

    const promises = sectionsWithSelectedCategories.map(
      async (section, sectionIndex) => {
        const { data: postSectionData, error: postSectionsError } =
          await supabase
            .from('post_sections')
            .insert({
              section_order: sectionIndex,
              post_id: postData.id,
              content: section.content,
              external_reference_url: section.external_reference_url,
              image_paths: section.image_paths,
            })
            .select()
            .single();

        if (postSectionsError) {
          throw { ...postSectionsError, cause: 'insert post_sections' };
        }

        const { error: postSectionCategoryError } = await supabase
          .from('post_section_categories')
          .insert(
            section.categories.map((category) => ({
              post_section_id: postSectionData.id,
              category_id: category.id,
            })),
          );

        if (postSectionCategoryError) {
          throw {
            ...postSectionCategoryError,
            cause: 'insert post_section_categories',
          };
        }
      },
    );

    await Promise.all(promises);

    push(pathMapper(props.posting_type, state.slug));
  }, [
    props.posting_type,
    push,
    state.image_paths,
    state.post_sections_state.post_sections,
    state.posting_type,
    state.slug,
    state.thumbnail_url,
    state.title,
    supabase,
  ]);

  const handleUpdate = React.useCallback(async () => {
    const sections = state.post_sections_state.post_sections
      .filter((section) => section.mode !== 'delete')
      .map((section, sectionIndex) => ({
        ...section,
        section_order: sectionIndex, // re-order
        categories: section.category_state.searched.filter(
          (category) => category.isSelected,
        ),
      }));

    const { data: postData, error } = await supabase
      .from('posts')
      .update({
        title: state.title,
        slug: state.slug,
        thumbnail_url: state.thumbnail_url,
        posting_type: state.posting_type,
        image_paths: state.image_paths,
        public: true,
      })
      .select()
      .single();

    if (error) {
      throw { ...error, cause: 'update post' };
    }

    const postCategoriesToBeInserted = sections
      .map((section) =>
        section.categories.filter((category) => category.isAddedInEditMode),
      )
      .flatMap((categories) =>
        categories.map((category) => ({
          post_id: postData.id,
          category_id: category.id!, // id is not null
        })),
      );

    const { error: postCategoriesError } = await supabase
      .from('post_categories')
      .insert(postCategoriesToBeInserted);

    if (postCategoriesError) {
      throw { ...postCategoriesError, cause: 'upsert post_categories' };
    }

    const postCategoriesToBeDeleted = sections
      .map((section) =>
        section.categories.filter((category) => category.isDeletedInEditMode),
      )
      .flatMap((categories) =>
        categories.map((category) => ({
          post_id: postData.id,
          category_id: category.id!, // id is not null
        })),
      );

    const { error: postCategoriesDeleteError } = await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', postData.id)
      .in(
        'category_id',
        postCategoriesToBeDeleted.map((category) => category.category_id),
      );

    if (postCategoriesDeleteError) {
      throw { ...postCategoriesDeleteError, cause: 'delete post_categories' };
    }

    const postSectionsToBeInserted = sections
      .filter((section) => section.mode === 'create')
      .map((section) => ({
        section_order: section.section_order,
        post_id: postData.id,
        content: section.content,
        external_reference_url: section.external_reference_url,
        image_paths: section.image_paths,
        categories: section.categories,
      }));

    const promises = postSectionsToBeInserted.map(async (section) => {
      const { data: postSectionData, error: postSectionsError } = await supabase
        .from('post_sections')
        .insert(section)
        .select()
        .single();

      if (postSectionsError) {
        throw { ...postSectionsError, cause: 'insert post_sections' };
      }

      const { error: postSectionCategoryError } = await supabase
        .from('post_section_categories')
        .insert(
          section.categories.map((category) => ({
            post_section_id: postSectionData.id,
            category_id: category.id!,
          })),
        );

      if (postSectionCategoryError) {
        throw {
          ...postSectionCategoryError,
          cause: 'insert post_section_categories',
        };
      }
    });

    await Promise.all(promises);

    const postSectionsToBeUpdated = sections
      .filter((section) => section.mode === 'edit')
      .map((section) => ({
        id: section.id!,
        section_order: section.section_order,
        content: section.content,
        external_reference_url: section.external_reference_url,
        image_paths: section.image_paths,
        categories: section.categories,
      }))
      .map(async ({ id, ...section }) => {
        const { error: updatePostSectionError } = await supabase
          .from('post_sections')
          .update(section)
          .eq('id', id);

        if (updatePostSectionError) {
          throw { ...updatePostSectionError, cause: 'update post_sections' };
        }

        const { error: deletePostSectionCategoriesError } = await supabase
          .from('post_section_categories')
          .delete()
          .in(
            'category_id',
            section.categories.map((category) => category.isDeletedInEditMode),
          );

        if (deletePostSectionCategoriesError) {
          throw {
            ...deletePostSectionCategoriesError,
            cause: 'delete post_section_categories',
          };
        }

        const { error: insertPostSectionCategoriesError } = await supabase
          .from('post_section_categories')
          .insert(
            section.categories
              .filter((category) => category.isAddedInEditMode)
              .map((category) => ({
                post_section_id: id,
                category_id: category.id!,
              })),
          );
        if (insertPostSectionCategoriesError) {
          throw {
            ...insertPostSectionCategoriesError,
            cause: 'insert post_section_categories',
          };
        }
      });

    await Promise.all(postSectionsToBeUpdated);

    const postSectionIdsToBeDeleted = sections
      .filter((section) => section.mode === 'delete')
      .map((section) => section.id!);

    const { error: deletePostSectionError } = await supabase
      .from('post_sections')
      .delete()
      .in('id', postSectionIdsToBeDeleted);

    if (deletePostSectionError) {
      throw { ...deletePostSectionError, cause: 'delete post_sections' };
    }

    const { error: deletePostSectionCategoriesError } = await supabase
      .from('post_section_categories')
      .delete()
      .in('post_section_id', postSectionIdsToBeDeleted);

    if (deletePostSectionCategoriesError) {
      throw {
        ...deletePostSectionCategoriesError,
        cause: 'delete post_section_categories',
      };
    }

    push(pathMapper(props.posting_type, state.slug));
  }, [
    props.posting_type,
    push,
    state.image_paths,
    state.post_sections_state.post_sections,
    state.posting_type,
    state.slug,
    state.thumbnail_url,
    state.title,
    supabase,
  ]);

  const handleClickSaveButton: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(async () => {
      if (state.title === '') {
        setModal({
          isOpen: true,
          message: 'The title is empty',
        });
        return;
      }

      setIsLoading(true);

      try {
        if (state.mode === 'edit') {
          await handleUpdate();
          return;
        }

        await handleSave();
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error)?.message ?? 'Unknown Error',
        });
      } finally {
        setIsLoading(false);
      }
    }, [handleSave, handleUpdate, state.mode, state.title]);

  const handleCloseModal = React.useCallback(() => {
    setModal(initialModalstate);
  }, []);

  return {
    fileInputRef,
    editorRef,
    state,
    modal,
    isLoading,
    handleChangeTitle,
    handleUploadThumbnail,
    handleChangeMarkdown,
    handleClickModalClose,
    handleClickPlusButton,
    handleChangeCategoryInput,
    handleClickCategoryToggle,
    handleUploadImage,
    handleChangeExternalReferenceUrl,
    handleClickEditSectionButton,
    handleClickDeleteSectionButton,
    handleClickSaveButton,
    handleCloseModal,
  };
}
