import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'ClassMemo',
  description: '一个毕业笔记站',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}