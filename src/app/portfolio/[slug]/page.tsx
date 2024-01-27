import { getPost, getPostSectionsBySlug } from '@/src/backend/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CustomLink from '@/src/components/ui/CustomLink';
import CopyText from '@/src/components/ui/CopyText';
import React from 'react';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export default async function PortfolioPost({
  params,
}: {
  params: { slug: string };
}) {
  // 한글 지원
  const lastSlug = decodeURIComponent(params.slug);

  const [post, postSections] = await Promise.all([
    getPost(lastSlug, 'portfolio'),
    getPostSectionsBySlug(lastSlug),
  ]);

  if (!post) {
    notFound();
  }

  const referer = headers().get('referer');
  const url = referer ? new NextRequest(referer).nextUrl.href : null;

  return (
    <div className="p-2">
      <CustomLink href="/b">Back to Portfolio</CustomLink>
      <p />
      {url && <CopyText text={url} />}
      <h1>{post.title}</h1>
      {postSections.map((section) => (
        <div
          key={`${section.posts?.id || 'post'}_${section.id}`}
          className="border my-2 p-2"
        >
          <MDXRemote source={section.content} />
        </div>
      ))}
    </div>
  );
}
