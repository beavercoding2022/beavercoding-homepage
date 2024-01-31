import { getFullPost } from '@/src/backend/posts';
import { UseWriterProps } from '@/src/components/Writer/useWriter';
import { Database } from '@/src/types_db';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type PostingType = NonNullable<
  Database['public']['Tables']['posts']['Row']['posting_type']
>;

export type OmitAndPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type Post = Awaited<ReturnType<typeof getFullPost>>;
export type PostSection = Post['post_sections'][number];
export type Category = Post['categories'][number];

export type PostSectionInsideState = OmitAndPartial<
  PostSection,
  'id' | 'user_id' | 'section_order' | 'post_id'
> & {
  mode: 'create' | 'edit' | 'delete' | 'not_edited';
  category_state: CategoryState;
};

export type CategoryState = {
  input: string;
  searched: (OmitAndPartial<Category, 'id' | 'created_at' | 'thumbnail_url'> & {
    isSelected: boolean;
    isDeletedInEditMode?: boolean;
    isAddedInEditMode?: boolean;
  })[];
};

const initialCategoryState: CategoryState = {
  input: '',
  searched: [],
};

export type PostSectionState = {
  post_sections: PostSectionInsideState[];
  current_index: number;
};

const initialPostSection: PostSectionState['post_sections'][number] = {
  content: '* Hello World',
  external_reference_url: null,
  image_paths: [],
  category_state: initialCategoryState,
  mode: 'create',
  categories: [],
};

const initialPostSectionState: PostSectionState = {
  post_sections: [initialPostSection],
  current_index: 0,
};

export const initialModalstate: { isOpen: boolean; message: string } = {
  isOpen: false,
  message: 'Default Modal',
};

type UseWriterState = {
  title: string;
  slug: string;
  posting_type: NonNullable<PostingType>;
  thumbnail_url: string | null;
  post_sections_state: PostSectionState;
  image_paths: string[];
  mode: 'edit' | 'create';
};

const initialState: UseWriterState = {
  title: '',
  thumbnail_url: null,
  slug: '',
  posting_type: 'blog',
  mode: 'create',
  post_sections_state: initialPostSectionState,
  image_paths: [],
};

export function createUseWriterInitialState(
  props: UseWriterProps,
): UseWriterState {
  if (props?.post) {
    return {
      ...initialState,
      title: props.post.title,
      slug: props.post.slug,
      thumbnail_url: props.post.thumbnail_url,
      posting_type: props.post.posting_type || 'blog',
      image_paths: [
        ...props.post.post_sections
          .map((section) => section.image_paths)
          .flat(),
        ...props.post.image_paths,
      ],
      post_sections_state: {
        post_sections: props.post.post_sections.map(
          (section) =>
            ({
              ...section,
              category_state: {
                input: '',
                searched: section.categories.map((category) => ({
                  ...category,
                  isSelected: true,
                  isDeletedInEditMode: false,
                  isAddedInEditMode: false,
                })),
              },
              categories: section.categories,
              mode: 'edit',
            }) satisfies PostSectionInsideState,
        ),
        current_index: 0,
      },
      mode: 'edit',
    };
  }

  return initialState;
}

export function useWriterSliceCreatorFn(props: UseWriterProps) {
  return createSlice({
    name: 'useWriter',
    initialState: createUseWriterInitialState(props),
    reducers: {
      setTitle(
        state,
        action: PayloadAction<{
          title: string;
          uuid: string;
        }>,
      ) {
        state.title = action.payload.title;
        state.slug = action.payload.uuid.slice(0, 8);
      },
      setThumbnail(state, action: PayloadAction<string>) {
        state.thumbnail_url = action.payload;
        state.image_paths.push(action.payload);
      },
      removeThumbnail(state) {
        state.thumbnail_url = null;
      },
      updateCurrentSectionContent(
        state,
        action: PayloadAction<{
          content: string;
          index: number;
        }>,
      ) {
        state.post_sections_state.post_sections[action.payload.index].content =
          action.payload.content;
        if (state.mode === 'edit') {
          state.post_sections_state.post_sections[action.payload.index].mode =
            'edit';
        }
      },
      addNewSection(state) {
        if (
          state.post_sections_state.post_sections[
            state.post_sections_state.current_index
          ].content === ''
        ) {
          return;
        }
        state.post_sections_state.post_sections.push({
          ...initialPostSection,
          mode: 'create',
        });
        state.post_sections_state.current_index =
          state.post_sections_state.post_sections.length - 1;
      },
      deleteSection(state, action: PayloadAction<{ index: number }>) {
        state.post_sections_state.post_sections[action.payload.index].mode =
          'delete';
      },
      updateCurrentSectionExternalReferenceUrl(
        state,
        action: PayloadAction<{
          url: string;
        }>,
      ) {
        state.post_sections_state.post_sections[
          state.post_sections_state.current_index
        ].external_reference_url = action.payload.url;
        if (state.mode === 'edit') {
          state.post_sections_state.post_sections[
            state.post_sections_state.current_index
          ].mode = 'edit';
        }
      },
      updateCurrentSectionImagePaths(
        state,
        action: PayloadAction<{
          path: string;
          index: number;
        }>,
      ) {
        if (
          !state.post_sections_state.post_sections[
            action.payload.index
          ].image_paths.includes(action.payload.path)
        ) {
          state.post_sections_state.post_sections[
            action.payload.index
          ].image_paths.push(action.payload.path);
        }

        if (!state.image_paths.includes(action.payload.path)) {
          state.image_paths.push(action.payload.path);
        }

        if (state.mode === 'edit') {
          state.post_sections_state.post_sections[action.payload.index].mode =
            'edit';
        }
      },
      removeCurrentSectionImagePath(
        state,
        action: PayloadAction<{
          path: string;
          index: number;
        }>,
      ) {
        state.post_sections_state.post_sections[
          action.payload.index
        ].image_paths = state.post_sections_state.post_sections[
          action.payload.index
        ].image_paths.filter((path) => path !== action.payload.path);

        state.image_paths = state.image_paths.filter(
          (path) => path !== action.payload.path,
        );

        if (state.mode === 'edit') {
          state.post_sections_state.post_sections[action.payload.index].mode =
            'edit';
        }
      },
      setCurrentSectionEdit(state, action: PayloadAction<{ index: number }>) {
        state.post_sections_state.current_index = action.payload.index;
      },
      setCategoryInput(
        state,
        action: PayloadAction<{
          input: string;
        }>,
      ) {
        state.post_sections_state.post_sections[
          state.post_sections_state.current_index
        ].category_state.input = action.payload.input;
      },
      setCategoriesSearched(state, action: PayloadAction<Category[]>) {
        const category_state =
          state.post_sections_state.post_sections[
            state.post_sections_state.current_index
          ].category_state;
        category_state.searched = action.payload.map((nextCat) => {
          const prevCatIndex = category_state.searched.findIndex(
            (prevCat) => prevCat.id === nextCat.id,
          );

          return {
            ...nextCat,
            isSelected:
              category_state.searched[prevCatIndex]?.isSelected ?? false,
          };
        });
      },
      toggleCategorySelected(state, action: PayloadAction<{ index: number }>) {
        const prev =
          state.post_sections_state.post_sections[
            state.post_sections_state.current_index
          ];

        // 원래 있던 카테고리는 prev.categories에 있음
        // 새로 추가된 카테고리는 prev.category_state.searched에 isSelected가 true인 것들

        if (
          state.mode === 'edit' && // edit 모드
          !prev.category_state.searched[action.payload.index].isSelected && // 해제되었다가 선택되는 상황
          prev.categories.findIndex(
            (category) =>
              category.id ===
              prev.category_state.searched[action.payload.index].id,
          ) < 0 // 원래 있던 카테고리가 아닌 경우
        ) {
          prev.category_state.searched[action.payload.index].isAddedInEditMode =
            true;
          prev.category_state.searched[
            action.payload.index
          ].isDeletedInEditMode = false;
        }

        if (
          state.mode === 'edit' && // edit 모드
          prev.category_state.searched[action.payload.index].isSelected && // 선택되었다가 해제되는 상황
          prev.categories.findIndex(
            (category) =>
              category.id ===
              prev.category_state.searched[action.payload.index].id,
          ) >= 0 // 원래 있던 카테고리인 경우
        ) {
          prev.category_state.searched[action.payload.index].isAddedInEditMode =
            false;
          prev.category_state.searched[
            action.payload.index
          ].isDeletedInEditMode = true;
        }

        prev.category_state.searched[action.payload.index].isSelected =
          !prev.category_state.searched[action.payload.index].isSelected;
      },
    },
  });
}
