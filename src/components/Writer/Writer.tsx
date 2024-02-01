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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CategorySelector from '@/src/components/Writer/CategorySelector';
import Section from '@/src/components/Writer/Section';
import useWriter, { UseWriterProps } from '@/src/components/Writer/useWriter';
import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';

import Image from 'next/image';
import React from 'react';

export default function Writer(props: React.PropsWithChildren<UseWriterProps>) {
  const {
    fileInputRef,
    editorRef,
    state,
    modal,
    isLoading,
    handleChangeTitle,
    handleChangeSeriesSlug,
    handleSeriesSelectValueChange,
    handleUploadThumbnail,
    handleChangeMarkdown,
    handleClickModalClose,
    handleClickPlusButton,
    handleChangeCategoryInput,
    handleClickCategoryToggle,
    handleCloseModal,
    handleUploadImage,
    handleChangeExternalReferenceUrl,
    handleClickEditSectionButton,
    handleClickDeleteSectionButton,
    handleClickSaveButton,
  } = useWriter(props);

  const {
    title,
    slug,
    thumbnail_url,
    post_sections_state,
    image_paths,
    searchedSeries,
    series_slug,
  } = state;

  if (isLoading) {
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
            onChange={handleChangeTitle}
          />
        </div>
        <p>slug: {slug}</p>
        <div className="flex md:flex-row flex-col gap-1.5">
          <div className="w-full items-center gap-1.5 my-2">
            <Label htmlFor="series">Series</Label>
            <Input
              type="text"
              id="series"
              value={series_slug || ''}
              onChange={handleChangeSeriesSlug}
            />
            <Select onValueChange={handleSeriesSelectValueChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Input a series slug" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'empty'}>Null</SelectItem>
                {searchedSeries.map((series) => (
                  <SelectItem key={series.id} value={String(series.id)}>
                    {series.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full items-center gap-1.5 my-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              onChange={handleUploadThumbnail}
              ref={fileInputRef}
            />
            <Button
              variant={'outline'}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.files = null;
                  fileInputRef.current.value = '';
                }
              }}
            >
              Remove
            </Button>
            {thumbnail_url && (
              <Image
                src={thumbnail_url}
                alt="thumbnail"
                width={200}
                height={200}
                priority={false}
                unoptimized
              />
            )}
          </div>
        </div>

        <div className="flex md:flex-row flex-col min-h-[500px]">
          <section className="flex flex-col flex-1 py-2 mr-1">
            <Label>Markdown</Label>

            <ForwardRefEditor
              ref={editorRef}
              markdown={
                post_sections_state.post_sections[
                  post_sections_state.current_index
                ].content
              }
              onChange={handleChangeMarkdown}
              handleUpload={handleUploadImage}
              imageAutocompleteSuggestions={image_paths}
            />
            <Label className="my-2" htmlFor="external_reference_url">
              External Reference URL
            </Label>
            <Input
              type="text"
              id="external_reference_url"
              value={
                post_sections_state.post_sections[
                  post_sections_state.current_index
                ].external_reference_url || ''
              }
              onChange={handleChangeExternalReferenceUrl}
            />
          </section>
          <section className="flex flex-1 flex-col py-2 ml-1 overflow-x-hidden">
            <Label>Preview</Label>
            {post_sections_state.post_sections.map((section, index) => (
              <React.Fragment key={`writing_section_index_${index}`}>
                <Section
                  markdown={section.content}
                  prevMode={section.prevMode}
                  nextMode={section.nextMode}
                  length={post_sections_state.post_sections.length}
                  currentIndex={post_sections_state.current_index}
                  renderingIndex={index}
                  onClickEdit={handleClickEditSectionButton(index)}
                  onClickDelete={handleClickDeleteSectionButton(index)}
                  externalReference={section.external_reference_url}
                />
                {post_sections_state.current_index === index && (
                  <CategorySelector
                    state={section.category_state}
                    handleClickCategoryToggle={handleClickCategoryToggle}
                    handleChangeCategoryInput={handleChangeCategoryInput}
                  />
                )}
              </React.Fragment>
            ))}
            <Button variant={'outline'} onClick={handleClickPlusButton}>
              +
            </Button>
          </section>
        </div>
        <Button variant={'outline'} onClick={handleClickSaveButton}>
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
