'use client'
'use client'
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchPreview from './SearchPreview';

interface Post {
  slug: string;
  title: string;
  content: string;
}

interface SearchWidgetProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  heroMode?: boolean;
  posts?: Post[];
}

export default function SearchWidget({
  onSearch,
  placeholder = "搜索内容...",
  heroMode = false,
  posts = []
}: SearchWidgetProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredPosts([]);
      setShowPreview(false);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
      setShowPreview(filtered.length > 0);
    }
  }, [query, posts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className={`flex items-center w-full rounded-full border border-gray-300 overflow-hidden transition-all duration-200 ${isFocused ? 'shadow-xl ring-2 ring-blue-500' : ''} ${heroMode ? 'py-3 px-6 bg-white bg-opacity-90 shadow-lg' : 'py-2 px-4 bg-gray-100'}`}>
          <div className={`p-2 ${heroMode ? 'bg-white bg-opacity-90' : 'bg-gray-100'}`}>
            <Search className={`h-5 w-5 ${heroMode ? 'text-gray-600' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setShowPreview(false);
            }}
            placeholder={placeholder}
            className={`flex-1 ${heroMode ? 'py-3 px-4 text-lg' : 'py-2 px-4'} bg-transparent outline-none ${heroMode ? 'text-gray-800 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
          />
        </div>
      </form>

      {showPreview && (
        <SearchPreview
          query={query}
          posts={filteredPosts}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}