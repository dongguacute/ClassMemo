'use client'
import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} - ${currentUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToWeibo = () => {
    const text = encodeURIComponent(`${title} - ${currentUrl}`);
    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl)}&title=${text}`, '_blank');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700"
      >
        <Share2 className="h-4 w-4" />
        分享
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[160px] z-50 animate-in fade-in-80 slide-in-from-bottom-2 duration-200">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? '已复制' : '复制链接'}
          </button>
          
          <button
            onClick={shareToTwitter}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            <div className="h-4 w-4 bg-blue-400 rounded"></div>
            Twitter
          </button>
          
          <button
            onClick={shareToWeibo}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            <div className="h-4 w-4 bg-red-500 rounded"></div>
            微博
          </button>
        </div>
      )}
    </div>
  );
}