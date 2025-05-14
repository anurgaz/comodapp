'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { PostPreview } from '@/types/post';
import { BigPostCard } from '@/components/BigPostCard';
import { SmallPostCard } from '@/components/SmallPostCard';
import { FixedSizeList as List } from 'react-window';

const POSTS_PER_PAGE = 20;

export default function Home() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPosts(1, true);
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async (pageToLoad: number, replace = false) => {
    setLoading(true);
    const response = await fetch(`/api/posts?page=${pageToLoad}&limit=${POSTS_PER_PAGE}`);
    const data = await response.json();
    setPosts(prev =>
      replace ? data.posts : [...prev, ...data.posts]
    );
    setHasMore(data.posts.length === POSTS_PER_PAGE);
    setPage(pageToLoad);
    setLoading(false);
  };

  // Intersection Observer для автоподгрузки
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading && !search) {
      fetchPosts(page + 1);
    }
  }, [hasMore, loading, page, search]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const option = { root: null, rootMargin: '20px', threshold: 0 };
    const observer = new window.IntersectionObserver(handleObserver, option);
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Контекстный поиск только по title
  const filtered = useMemo(() => (
    search
      ? posts.filter(
          p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        )
      : posts
  ), [posts, search]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => b.publishedAt - a.publishedAt), [filtered]);
  const [latest, ...rest] = sorted;

  // Для windowing: только маленькие карточки
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = rest[index];
    return (
      <div style={style}>
        <Link href={`/post/${post.id}`}>
          <SmallPostCard post={post} />
        </Link>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Последние новости</h1>
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      {latest && (
        <Link href={`/post/${latest.id}`}>
          <BigPostCard post={latest} />
        </Link>
      )}
      <List
        height={600}
        itemCount={rest.length}
        itemSize={100}
        width="100%"
      >
        {Row}
      </List>
      <div ref={loaderRef} />
      {loading && <div className="text-center text-gray-400">Загрузка...</div>}
      {!hasMore && !loading && <p className="text-center text-gray-400">Больше новостей нет</p>}
    </main>
  );
}