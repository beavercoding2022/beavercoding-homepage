import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type SectionProps = {
  markdown: string;
  currentIndex: number;
  renderingIndex: number;
  length: number;
  onClickEdit: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onClickDelete: React.MouseEventHandler<HTMLButtonElement> | undefined;
  externalReference: string | null;
};

export default function Section({
  markdown,
  currentIndex,
  renderingIndex,
  length,
  externalReference,
  onClickEdit,
  onClickDelete,
}: SectionProps) {
  return (
    <div className="relative border-2 my-2 p-2 min-h-[25px]">
      <div className="absolute top-0 right-0">
        {currentIndex !== renderingIndex && (
          <Button variant={'outline'} onClick={onClickEdit}>
            Edit
          </Button>
        )}
        {length > 1 && (
          <Button variant={'outline'} onClick={onClickDelete}>
            Delete
          </Button>
        )}
      </div>
      <Markdown
        remarkPlugins={[
          [
            remarkGfm,
            {
              singleTilde: false,
              emphasis: true,
              strikethrough: true,
              tableCellPadding: true,
            },
          ],
        ]}
      >
        {markdown}
      </Markdown>
      {externalReference && (
        <div className="text-xs text-gray-500">{externalReference}</div>
      )}
    </div>
  );
}
