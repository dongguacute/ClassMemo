'use client'
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Post {
  slug: string;
  title: string;
  content: string;
}

interface SearchPreviewProps {
  query: string;
  posts: Post[];
  onClose: () => void;
}

export default function SearchPreview({ query, posts, onClose }: SearchPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % posts.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + posts.length) % posts.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (posts.length > 0) {
          router.push(`/${posts[selectedIndex].slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts, selectedIndex, router]);

  const handlePostClick = (slug: string) => {
    onClose();
    router.push(`/${slug}`);
  };

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      ref={previewRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg z-20 border border-gray-200"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{query}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
          aria-label="关闭搜索预览"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          没有找到匹配的结果
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {posts.map((post, index) => (
            <div
              key={post.slug}
              className={`block p-4 hover:bg-gray-50 transition-colors cursor-pointer ${index === selectedIndex ? 'bg-gray-100' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handlePostClick(post.slug);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePostClick(post.slug);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {highlightText(post.title, query)}
              </h3>
              <p className="text-gray-600 text-sm">
                {highlightText(post.content, query)}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}