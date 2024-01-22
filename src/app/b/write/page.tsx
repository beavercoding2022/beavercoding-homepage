'use client';

import { ForwardRefEditor } from '@/src/components/ui/Editor/ForwardedEditor';
import React from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import sluggify from '@/src/utils/sluggify';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/src/types_db';
import Button from '@/src/components/ui/Button';
import { MDXRemote } from 'next-mdx-remote';
import Writer from '@/src/components/Writer/Writer';

const postingType: Database['public']['Tables']['posts']['Row']['posting_type'] =
  'blog';

export default function WriteBlogPost() {
  return <Writer postingType={'blog'} />;
}
