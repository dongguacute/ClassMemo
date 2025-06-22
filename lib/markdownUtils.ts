import { promises as fs } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  cover?: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export async function getMarkdownData(slug: string): Promise<Post> {
  const fullPath = path.join(contentDirectory, slug, 'index.md');
  const fileContents = await fs.readFile(fullPath, 'utf8');
  
  const { data, content } = matter(fileContents);
  
  // Process special syntax before markdown conversion
  let processedMarkdown = content;
  
  // Handle CSV blocks before remark processes them
  processedMarkdown = processedMarkdown.replace(
    /```csv\n([\s\S]*?)\n```/g,
    (match, csvContent) => {
      const lines = csvContent.trim().split('\n');
      if (lines.length === 0) return match;
      
      const headers = lines[0].split(',').map((h: string) => h.trim());
      const rows = lines.slice(1).map((line: string) => line.split(',').map((cell: string) => cell.trim()));
      
      let tableHtml = '<table class="csv-table">';
      tableHtml += '<thead><tr>';
      headers.forEach((header: string) => {
        tableHtml += `<th>${header}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      
      rows.forEach((row: string[]) => {
        tableHtml += '<tr>';
        row.forEach((cell: string) => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      });
      
      tableHtml += '</tbody></table>';
      return tableHtml;
    }
  );

  const processedContent = await remark()
    .use(html)
    .process(processedMarkdown);
    
  return {
    slug,
    content: processedContent.toString(),
    ...data as { title: string; date: string; author: string; cover?: string }
  };
}

export async function getAllMarkdownFiles(): Promise<Post[]> {
  const dirs = await readdir(contentDirectory, { withFileTypes: true });
  const posts = await Promise.all(
    dirs.filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .map(async slug => getMarkdownData(slug))
  );
  return posts;
}

export async function getAllMarkdownSlugs(): Promise<string[]> {
  const dirs = await readdir(contentDirectory, { withFileTypes: true });
  return dirs.filter(dirent => dirent.isDirectory())
              .map(dirent => dirent.name);
}
