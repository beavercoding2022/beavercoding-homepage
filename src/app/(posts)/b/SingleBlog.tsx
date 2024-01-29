import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
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
        />
      )}
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
