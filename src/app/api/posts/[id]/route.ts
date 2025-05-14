import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/services/database';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  props: Props
) {
  try {
    const post = await getPost(props.params.id);
    
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