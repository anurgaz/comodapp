import { PrismaClient } from '@prisma/client';
import { Post } from '@/types/post';

const prisma = new PrismaClient();

export async function createPost(text: string, imageUrl?: string): Promise<Post> {
  // Получаем первое предложение до точки
  const firstSentence = text.split('.')[0].trim();
  
  return prisma.post.create({
    data: {
      title: firstSentence,
      body: text,
      coverImage: imageUrl,
    },
  });
}

export async function getPosts(): Promise<Post[]> {
  return prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPost(id: string): Promise<Post | null> {
  return prisma.post.findUnique({
    where: { id },
  });
} 