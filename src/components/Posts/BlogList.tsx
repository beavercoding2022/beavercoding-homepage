'use client';

import CustomLink from '@/src/components/ui/CustomLink';
import { Database } from '@/src/types_db';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

type Post = Database['public']['Tables']['posts']['Row'];

type BlogsProps = {
  initialPosts: Post[];
  preferredLanguage: string;
};

export default function BlogList({
  initialPosts,
  preferredLanguage,
}: React.PropsWithChildren<BlogsProps>) {
  const fetching = React.useRef(false);
  const [pages, setPages] = React.useState({
    items: [initialPosts],
    hasMore: true,
  });
  const posts = React.useMemo(
    () => pages.items.flatMap((page) => page),
    [pages.items],
  );

  const loadMore = React.useCallback(async (page: number) => {
    if (fetching.current) {
      return;
    }

    try {
      fetching.current = true;
      const response = await fetch(
        `/api/posts?page=${page}&pageSize=10&posting-type=blog`,
      );
      const data = (await response.json()) as {
        posts: Post[];
      };

      setPages((prev) => {
        if (data.posts.length === 0) {
          return {
            items: prev.items,
            hasMore: false,
          };
        }

        return {
          items: [...prev.items, data.posts],
          hasMore: true,
        };
      });
    } finally {
      fetching.current = false;
    }
  }, []);

  if (posts.length === 0) {
    return <div>No blog posts now.</div>;
  }

  return (
    <InfiniteScroll
      hasMore={pages.hasMore}
      pageStart={1}
      loadMore={loadMore}
      loader={
        <span key={0} className="loader">
          Loading ...
        </span>
      }
      element="main"
    >
      {posts.map((post) => (
        <div key={post.id} className="flex flex-row border-y border-dashed">
          <span className="flex-1">
            <CustomLink href={`/b/${post.slug}`}>{post.title}</CustomLink>
          </span>
          <span>
            {new Date(post.created_at).toLocaleString(preferredLanguage)}
          </span>
        </div>
      ))}
    </InfiniteScroll>
  );
}
