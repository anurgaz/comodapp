'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types/post';
import { formatDate } from '@/utils/date';

function splitTitleBody(text: string) {
  const dotIdx = text.indexOf('.') !== -1 ? text.indexOf('.') : text.length;
  return {
    title: text.slice(0, dotIdx + 1).trim(),
    body: text.slice(dotIdx + 1).trim(),
  };
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Пост не найден</div>;
  }

  const { title, body } = splitTitleBody(post.title);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <div className="prose prose-lg max-w-none mb-6">{body || post.body}</div>
      <time className="block mt-8 text-gray-500">
        {formatDate(post.publishedAt)}
      </time>
    </article>
  );
} 