import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import sluggify from '@/src/utils/sluggify';
import Button from '@/src/components/ui/Button';
import { Database } from '@/src/types_db';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type WriterProps = {
  postingType: Database['public']['Tables']['posts']['Row']['posting_type'];
};

export default function Writer({
  postingType,
}: React.PropsWithChildren<WriterProps>) {
  const [supabase] = React.useState(() => createPagesBrowserClient());
  const [title, setTitle] = React.useState<string>('blog post title');
  const [imagePaths, setImagePathes] = React.useState<string[]>([]);
  const [markdown, setMarkdown] = React.useState<string>(`
* Item 1
* Item 2
* Item 3
* nested item

1. Item 1
2. Item 2
  `);

  const slug = React.useMemo(() => {
    const id = uuidv4();
    return `${sluggify(title)}-${id}`;
  }, [title]);

  const handleUpload = React.useCallback(
    async function (image: File): Promise<string> {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`${postingType}/${slug}/${image.name}`, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(error);
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
    setMarkdown(markdown);
  }, []);

  return (
    <div>
      <div className="flex md:flex-row flex-col">
        <section className="flex flex-1 p-2">
          <ForwardRefEditor
            markdown={markdown}
            onChange={onChangeMarkdown}
            handleUpload={handleUpload}
            imageAutocompleteSuggestions={imagePaths}
          />
        </section>
        <section className="flex flex-1 flex-col p-2 ">
          <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
            {markdown}
          </Markdown>
          <Button>+</Button>
        </section>
      </div>
      <Button>Save Changes</Button>
    </div>
  );
}
