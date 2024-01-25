'use client';

import CustomLink from '@/src/components/ui/CustomLink';
import { Database } from '@/src/types_db';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

type Post = Database['public']['Tables']['posts']['Row'];

type PortfoliosProps = {
  initialPortfolios: Post[];
};

export default function PortfolioList({
  initialPortfolios,
}: React.PropsWithChildren<PortfoliosProps>) {
  const fetching = React.useRef(false);
  const [pages, setPages] = React.useState({
    items: [initialPortfolios],
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
      const response = await fetch(`/api/posts?page=${page}?posting-type=blog`);
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

  return (
    <InfiniteScroll
      hasMore={pages.hasMore}
      pageStart={0}
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
            <CustomLink href={`/portfolio/${post.slug}`}>
              {post.title}
            </CustomLink>
          </span>
        </div>
      ))}
    </InfiniteScroll>
  );
}
