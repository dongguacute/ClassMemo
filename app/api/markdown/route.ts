import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function GET(request: Request) {
  try {
    const contentDirectory = path.join(process.cwd(), 'content');
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (slug) {
      // Return single post
      const fullPath = path.join(contentDirectory, slug, 'index.md');
      const fileContents = await fs.readFile(fullPath, 'utf8');

      const { data, content } = matter(fileContents);
      const processedContent = await remark()
        .use(html)
        .process(content);

      return NextResponse.json({
        slug,
        content: processedContent.toString(),
        ...data as { title: string; date: string; author: string; cover?: string }
      });
    } else {
      // Return all posts
      const dirs = await readdir(contentDirectory, { withFileTypes: true });
      const posts = await Promise.all(
        dirs.filter(dirent => dirent.isDirectory())
              .map(dirent => dirent.name)
              .map(async slug => {
                const fullPath = path.join(contentDirectory, slug, 'index.md');
                const fileContents = await fs.readFile(fullPath, 'utf8');

                const { data, content } = matter(fileContents);
                const processedContent = await remark()
                  .use(html)
                  .process(content);

                return {
                  slug,
                  content: processedContent.toString(),
                  ...data as { title: string; date: string; author: string; cover?: string }
                };
              })
      );
      return NextResponse.json(posts);
    }
  } catch {
    return NextResponse.json({ error: 'Failed to read markdown files' }, { status: 500 });
  }
}