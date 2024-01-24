import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type SectionProps = {
  markdown: string;
};

export default function Section({ markdown }: SectionProps) {
  return (
    <div className="border-2 my-2 p-2">
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
