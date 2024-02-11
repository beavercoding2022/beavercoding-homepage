import { getSession } from '@/src/app/supabase-server';
import { getPosts } from '@/src/backend/posts';
import PortfolioList from '@/src/components/Posts/PortfolioList';
import CustomLink from '@/src/components/ui/CustomLink';

export default async function PortfolioPage() {
  const [session, posts] = await Promise.all([
    getSession(),
    getPosts('portfolio'),
  ]);

  return (
    <div className="flex flex-col">
      {session && (
        <>
          <CustomLink href={'/portfolio/write'}>Write Portfolio</CustomLink>
          <div className="mb-5" />
        </>
      )}
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <PortfolioList initialPortfolios={posts} />
    </div>
  );
}
