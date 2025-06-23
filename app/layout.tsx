import type { Metadata } from 'next';
import './globals.css';
import BottomNav from './components/BottomNav';
import { SearchProvider } from './context/SearchContext';

export const metadata: Metadata = {
  title: 'ClassMemo',
  description: 'ClassMemo Application',
  icons: {
    icon: "/ldnote.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">
        <SearchProvider>
          {children}
          <BottomNav />
        </SearchProvider>
      </body>
    </html>
  );
}
