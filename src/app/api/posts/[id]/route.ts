import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/types/post';
import { getPost } from '@/services/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPost(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    return NextResponse.json(
      { error: 'Не удалось получить пост' },
      { status: 500 }
    );
  }
} 