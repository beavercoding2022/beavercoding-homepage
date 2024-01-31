import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import CategoryIcon from '@/src/components/icons/CategoryIcon';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

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
        />
      )}
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
          {section.categories.map((category) => (
            <CategoryIcon
              key={`section_${section.id}_categories_${category.id}`}
              {...category}
            />
          ))}
        </div>
      ))}
    </>
  );
}
