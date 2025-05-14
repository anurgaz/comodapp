import { PrismaClient } from '@prisma/client';
import { Post } from '@/types/post';

const prisma = new PrismaClient();

export async function createPost(post: Post): Promise<void> {
  await prisma.post.create({
    data: {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      body: post.body,
      imageUrl: post.imageUrl,
      publishedAt: new Date(post.publishedAt * 1000), // Convert Unix timestamp to Date
      channelId: post.channelId,
      messageId: post.messageId
    }
  });
}

export async function getPost(id: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) return null;

  return {
    ...post,
    publishedAt: Math.floor(post.publishedAt.getTime() / 1000) // Convert Date to Unix timestamp
  };
}

export async function getPosts(page: number, limit: number): Promise<{ posts: Post[]; total: number }> {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.post.count()
  ]);

  return {
    posts: posts.map(post => ({
      ...post,
      publishedAt: Math.floor(post.publishedAt.getTime() / 1000)
    })),
    total
  };
} 