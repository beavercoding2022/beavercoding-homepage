import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryState } from '@/src/components/Writer/Writer';
import { Database } from '@/src/types_db';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

export type CategorySelectorProps = {
  state: CategoryState;
  setState: React.Dispatch<React.SetStateAction<CategoryState>>;
};

export default function CategorySelector({
  state,
  setState,
}: React.PropsWithChildren<CategorySelectorProps>) {
  const [supabase] = React.useState(() => createPagesBrowserClient<Database>());

  React.useEffect(() => {
    if (state.inputCategory.length === 0) {
      supabase
        .from('categories')
        .select('*')
        .then(({ data }) => {
          setState((prev) => ({
            ...prev,
            searchedCategories: data || [],
          }));
        });
    }

    if (state.inputCategory.length > 0) {
      supabase
        .from('categories')
        .select('*')
        .ilike('name', `${state.inputCategory}%`)
        .then(({ data }) => {
          setState((prev) => ({
            ...prev,
            searchedCategories: data || [],
          }));
        });
    }
  }, [setState, state.inputCategory, supabase]);

  return (
    <>
      <Label htmlFor="category">Category</Label>
      <div className="flex flex-row my-4">
        <div className="flex flex-1 flex-row items-center gap-1.5">
          <Input
            type="text"
            id="category"
            value={state.inputCategory}
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                inputCategory: e.target.value,
              }));
            }}
          />
          <Button variant="outline">Search</Button>
        </div>
      </div>
      <div className="flex flex-row overflow-scroll max-w-full gap-2">
        {state.searchedCategories.map((category) => (
          <Button
            key={category.id}
            variant={
              state.selectedCategories.map((v) => v.id).includes(category.id)
                ? 'default'
                : 'outline'
            }
            onClick={() => {
              setState((prev) => {
                if (prev.selectedCategories.includes(category)) {
                  return {
                    ...prev,
                    selectedCategories: prev.selectedCategories.filter(
                      (c) => c.id !== category.id,
                    ),
                  };
                }

                return {
                  ...prev,
                  selectedCategories: [...prev.selectedCategories, category],
                };
              });
            }}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </>
  );
}
