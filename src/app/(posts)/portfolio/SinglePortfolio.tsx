import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';

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
      {post.thumbnail_url && (
        <Image
          src={post.thumbnail_url}
          alt={post.title}
          width={300}
          height={300}
          unoptimized
          priority={false}
        />
      )}
      {postSections
        .sort((a, b) => a.section_order - b.section_order)
        .map((section) => (
          <div
            key={`${section.posts?.id || 'post'}_${section.id}`}
            className="border my-2 p-2"
          >
            <MDXRemote source={section.content} />
            {section.external_reference_url && (
              <span className="text-sm">{section.external_reference_url}</span>
            )}
            {section.external_reference_url && (
              <Link
                href={section.external_reference_url}
                className="text-sm underline-none text-gray-400"
                target="_blank"
              >
                Read More on external link
              </Link>
            )}
          </div>
        ))}
    </>
  );
}
