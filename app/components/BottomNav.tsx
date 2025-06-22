'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/app/context/SearchContext';

export default function BottomNav() {
  const [atBottom, setAtBottom] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setAtBottom(isBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search functionality will be handled by the SearchContext
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/80 border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <AnimatePresence>
          {atBottom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-2 text-xs text-gray-500"
            >
              © {new Date().getFullYear()} ClassMemo. All rights reserved. Maintained by LindongNote
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <form onSubmit={handleSearch} className="flex-1 mx-4 flex items-center bg-gray-100 rounded-full px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文档..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="submit" className="ml-2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}