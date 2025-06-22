import { getMarkdownData } from '@/lib/markdownUtils';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const paramsResolved = await params;
    const post = await getMarkdownData(paramsResolved.slug);
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}
