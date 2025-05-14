import { NextResponse } from 'next/server';
import { PostPreview, PaginationInfo } from '@/types/post';
import { getPosts } from '@/services/database';

const POSTS_PER_PAGE = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || String(POSTS_PER_PAGE));

  try {
    const { posts, total } = await getPosts(page, limit);
    const totalPages = Math.ceil(total / limit);

    const pagination: PaginationInfo = {
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      currentPage: page,
      totalPages
    };

    return NextResponse.json({ posts, pagination });
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить посты' },
      { status: 500 }
    );
  }
} 