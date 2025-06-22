'use client'
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 解析标题生成目录
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level });
    }

    setToc(headings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 max-w-xs">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-lg"
        >
          <div className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>目录</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        {isOpen && (
          <div className="max-h-96 overflow-y-auto p-2">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors ${
                  activeId === item.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'
                }`}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}