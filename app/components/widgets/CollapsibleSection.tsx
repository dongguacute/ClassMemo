'use client'
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'bordered' | 'highlighted';
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  variant = 'default'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          container: 'border border-gray-200 rounded-lg',
          header: 'bg-gray-50 px-4 py-3 border-b border-gray-200',
          content: 'p-4'
        };
      case 'highlighted':
        return {
          container: 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg',
          header: 'bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3',
          content: 'p-4'
        };
      default:
        return {
          container: 'bg-gray-50 rounded-lg',
          header: 'px-4 py-3',
          content: 'px-4 pb-4'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`my-4 ${styles.container}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-blue-600 transition-colors ${styles.header}`}
      >
        <span>{title}</span>
        <div className="text-gray-500">
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </button>
      {isOpen && (
        <div className={`${styles.content} animate-in slide-in-from-top-2 duration-200`}>
          {children}
        </div>
      )}
    </div>
  );
}