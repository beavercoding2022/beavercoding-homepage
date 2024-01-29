import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CategoryIcon from '@/src/components/icons/CategoryIcon';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';
import CustomLink from '@/src/components/ui/CustomLink';
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
        <CategoryLinkWithIcon
          key={`post_categories_${category.id}`}
          {...category}
        />
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
