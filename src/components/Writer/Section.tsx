import { Button } from '@/components/ui/button';
import { PostSectionInsideState } from '@/src/components/Writer/useWriter.slice';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type SectionProps = {
  markdown: string;
  currentIndex: number;
  renderingIndex: number;
  prevMode: PostSectionInsideState['prevMode'];
  nextMode: PostSectionInsideState['nextMode'];
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
  prevMode,
  nextMode,
  externalReference,
  onClickEdit,
  onClickDelete,
}: SectionProps) {
  return (
    <div className="relative border-2 my-2 p-2 min-h-[25px]">
      {nextMode === 'delete' && (
        <div className="absolute w-full h-full top-0 left-0 bg-white opacity-50 z-10">
          <div className="text-center text-2xl text-red-500">Deleted</div>
        </div>
      )}
      <div className="absolute top-0 right-0 z-10">
        {currentIndex !== renderingIndex && (
          <Button variant={'outline'} onClick={onClickEdit}>
            Edit
          </Button>
        )}
        {length > 1 && (
          <Button variant={'outline'} onClick={onClickDelete}>
            {nextMode === 'delete' ? 'Undo' : 'Delete'}
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
