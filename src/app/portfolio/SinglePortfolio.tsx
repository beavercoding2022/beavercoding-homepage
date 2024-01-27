import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export type SinglePortfolioProps = {
  post: Awaited<ReturnType<typeof getPost>>;
  postSections: Awaited<ReturnType<typeof getPostSectionsBySlug>>;
};

export default function SinglePortfolio({
  post,
  postSections,
}: SinglePortfolioProps) {
  return (
    <>
      <h1>{post.title}</h1>
      {post.categories.map((category) => (
        <span key={category.id}>{category.name}</span>
      ))}
      {postSections.map((section) => (
        <div
          key={`${section.posts?.id || 'post'}_${section.id}`}
          className="border my-2 p-2"
        >
          <MDXRemote source={section.content} />
        </div>
      ))}
    </>
  );
}
