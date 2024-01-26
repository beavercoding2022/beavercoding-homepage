import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type SectionProps = {
  markdown: string;
  current: boolean;
  onClickEdit: () => void;
};

export default function Section({
  markdown,
  current,
  onClickEdit,
}: SectionProps) {
  return (
    <div className="relative border-2 my-2 p-2">
      {!current && (
        <Button
          onClick={() => {
            onClickEdit();
          }}
          className="absolute top-0 right-0"
        >
          Edit
        </Button>
      )}
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
    </div>
  );
}
