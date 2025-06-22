import React from 'react';
import { getMarkdownData } from '@/lib/markdownUtils';

export default async function MarkdownPage({ params }: { params: Promise<{ slug: string }> }) {
  const paramsResolved = await params;
  const post = await getMarkdownData(paramsResolved.slug);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose prose-lg">
        <h1>{post.title}</h1>
        <div className="text-gray-500 text-sm mb-6">
          <span>By {post.author}</span> • <span>{post.date}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}