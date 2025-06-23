'use client'
'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SearchWidget from '@/app/components/widgets/SearchWidget';
import { SearchProvider, useSearch } from '@/app/context/SearchContext';
import BottomNav from '@/app/components/BottomNav';

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  content: string;
  cover: string;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const postsData = await response.json();
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  return (
    <SearchProvider>
      <div className="min-h-screen" style={{ paddingBottom: '80px' }}>
        {/* Background */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* Header */}
        <AnimatePresence>
          {scrolled && (
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 p-4 backdrop-blur-md bg-white bg-opacity-20 z-10"
            >
              <div className="container mx-auto flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={40}
                  className="h-10 w-auto mr-4"
                />
                <div className="relative flex-1 max-w-xl">
                  <SearchWidget
                    onSearch={handleSearch}
                    placeholder="搜索文档..."
                    posts={posts}
                  />
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="h-screen flex items-center justify-center p-4">
            <div className="text-center w-full max-w-2xl">
              <motion.div
                animate={{
                  scale: scrolled ? 0.8 : 1,
                  opacity: scrolled ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={320}
                  height={80}
                  className="h-20 w-auto mx-auto"
                />
              </motion.div>

              <motion.h1
                animate={{
                  y: scrolled ? -100 : 0,
                  opacity: scrolled ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-extrabold text-white mb-8"
              >
                ClassMemo
              </motion.h1>

              <motion.div
                animate={{
                  y: scrolled ? -180 : 0,
                  width: scrolled ? '100%' : '100%'
                }}
                transition={{ duration: 0.3 }}
                className="relative w-full mx-auto"
              >
                <SearchWidget
                  onSearch={handleSearch}
                  placeholder="搜索文档..."
                  heroMode={true}
                  posts={posts}
                />
              </motion.div>
            </div>
          </section>

          {/* Blog Posts Content */}
          <section className="min-h-screen bg-white bg-opacity-90 p-8 pt-32">
            <div className="container mx-auto max-w-4xl">
              <div className="space-y-8 mt-12">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">加载文档中...</p>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPosts.map((post) => (
                      <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square bg-gray-100 rounded-xl flex flex-col overflow-hidden shadow-md cursor-pointer"
                      >
                        <a href={`/${post.slug}`} className="flex-1 flex items-center justify-center">
                          {post.cover ? (
                            <Image
                              src={post.cover}
                              alt={post.title}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl text-gray-400">#</span>
                          )}
                        </a>
                        <div className="p-2 bg-white bg-opacity-80">
                          <h3 className="text-sm font-bold truncate">{post.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {searchQuery ? (
                      <p className="text-gray-600">未找到匹配的文档</p>
                    ) : (
                      <p className="text-gray-600">暂无文档</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </SearchProvider>
  );
}

