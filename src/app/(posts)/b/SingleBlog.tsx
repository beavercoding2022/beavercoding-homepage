import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CategoryIcon from '@/src/components/icons/CategoryIcon';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type SingleBlogProps = {
  post: Awaited<ReturnType<typeof getPost>>;
  postSections: Awaited<ReturnType<typeof getPostSectionsBySlug>>;
};

export default function SingleBlog({ post, postSections }: SingleBlogProps) {
  return (
    <>
      <h1>{post.title}</h1>
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

      {post.categories.map((category) => (
        <CategoryLinkWithIcon
          key={`post_categories_${category.id}`}
          {...category}
        />
      ))}

      {postSections.map((section) => (
        <React.Fragment key={`${section.posts?.id || 'post'}_${section.id}`}>
          <div className="border my-2 p-2">
            <MDXRemote source={section.content} />
          </div>
          {section.external_reference_url && (
            <Link
              href={section.external_reference_url}
              className="text-sm underline-none text-gray-400"
              rel="noopener noreferrer"
              target="_blank"
            >
              Read More on external link
            </Link>
          )}
          <div className="flex flex-row">
            {section.categories.map((category) => (
              <CategoryIcon
                key={`section_${section.id}_categories_${category.id}`}
                {...category}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
