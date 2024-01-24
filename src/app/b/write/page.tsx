import dynamic from 'next/dynamic';

const Writer = dynamic(() => import('@/src/components/Writer/Writer'), {
  ssr: false,
});

export default function WriteBlogPost() {
  return <Writer postingType={'blog'} />;
}
