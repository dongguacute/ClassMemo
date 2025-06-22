import React from 'react';
import { getMarkdownData } from '@/lib/markdownUtils';
import Image from 'next/image';
import MarkdownContent from './MarkdownContent'; // 客户端组件
import { notFound } from 'next/navigation';
import TableOfContents from '@/app/components/widgets/TableOfContents';
import ReadingProgress from '@/app/components/widgets/ReadingProgress';
import BackToTop from '@/app/components/widgets/BackToTop';
import ShareButtons from '@/app/components/widgets/ShareButtons';
import { Clock, User, Calendar } from 'lucide-react';




export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // 服务器端数据获取
  const paramsResolved = await params;
  const post = await getMarkdownData(paramsResolved.slug);
  
  if (!post) {
    return notFound();
  }
  
  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative">
          {post.cover && (
            <div className="relative h-[60vh] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-20 flex items-end">
                <div className="container mx-auto px-4 pb-12">
                  <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{Math.ceil(post.content.length / 1000)} 分钟阅读</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!post.cover && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-24">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  {post.title}
                </h1>
                <div className="flex justify-center items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{Math.ceil(post.content.length / 1000)} 分钟阅读</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Article Actions */}
          <div className="flex justify-end mb-8">
            <ShareButtons title={post.title} />
          </div>

          {/* Main Content */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-24">
            <div className="p-8 lg:p-12">
              <MarkdownContent content={post.content} />
            </div>
            
            {/* Article Footer */}
            <div className="bg-gray-50 px-8 lg:px-12 py-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  最后更新: {new Date(post.date).toLocaleDateString()}
                </div>
                <ShareButtons title={post.title} />
              </div>
            </div>
          </article>
        </div>

        {/* Widgets */}
        <TableOfContents content={post.content} />
        <BackToTop />
      </div>
    </>
  );
}

