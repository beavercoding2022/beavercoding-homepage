import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseWriterReturn } from '@/src/components/Writer/useWriter';
import { CategoryState } from '@/src/components/Writer/useWriter.slice';
import React from 'react';

export type CategorySelectorProps = {
  state: CategoryState;
  handleClickCategoryToggle: UseWriterReturn['handleClickCategoryToggle'];
  handleChangeCategoryInput: UseWriterReturn['handleChangeCategoryInput'];
};

export default function CategorySelector({
  state,
  handleClickCategoryToggle,
  handleChangeCategoryInput,
}: React.PropsWithChildren<CategorySelectorProps>) {
  return (
    <>
      <Label htmlFor="category">Category</Label>
      <div className="flex flex-row my-4">
        <div className="flex flex-1 flex-row items-center gap-1.5 overflow-scroll max-w-full">
          <Input
            type="text"
            id="category"
            value={state.input}
            onChange={handleChangeCategoryInput}
          />
        </div>
      </div>
      <div className="flex flex-row overflow-scroll max-w-full gap-2">
        {state.searched.map((category, index) => (
          <Button
            key={category.id}
            variant={category.isSelected ? 'default' : 'outline'}
            onClick={handleClickCategoryToggle(index)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </>
  );
}
