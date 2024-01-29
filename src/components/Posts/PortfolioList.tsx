'use client';

import { getPosts } from '@/src/backend/posts';
import CustomLink from '@/src/components/ui/CustomLink';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import CategoryLinkWithIcon from '@/src/components/icons/CategoryLinkWithIcon';

type PortfoliosProps = {
  initialPortfolios: Awaited<ReturnType<typeof getPosts>>;
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
      const response = await fetch(
        `/api/posts?page=${page}&pageSize=10&posting-type=portfolio`,
      );
      const data = (await response.json()) as {
        posts: PortfoliosProps['initialPortfolios'];
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
        <section key={post.id} className="flex flex-col border-y border-dashed">
          <CustomLink href={`/portfolio/${post.slug}`}>{post.title}</CustomLink>
          <div className="flex flex-row">
            <div className="flex flex-col flex-1 min-h-[300px] justify-center items-center border-slate-400 border-2 mr-1">
              {post?.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  width={300}
                  height={300}
                />
              ) : (
                <p>No Image</p>
              )}
            </div>
            <div className="flex flex-col flex-1 ml-1">
              <div>
                {post.categories.map((category) => (
                  <CategoryLinkWithIcon
                    key={`post_${post.id}_categories_${category.id}`}
                    {...category}
                  />
                ))}
              </div>
              {post.post_sections?.[0] && (
                <Markdown
                  remarkPlugins={[
                    [
                      remarkGfm,
                      {
                        singleTilde: false,
                        emphasis: true,
                        strikethrough: true,
                        tableCellPadding: true,
                      },
                    ],
                  ]}
                >
                  {post.post_sections?.[0].content}
                </Markdown>
              )}
            </div>
          </div>
        </section>
      ))}
    </InfiniteScroll>
  );
}
