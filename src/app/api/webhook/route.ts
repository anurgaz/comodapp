import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/services/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Проверяем, что это сообщение из канала
    if (!body.message?.text) {
      return NextResponse.json({ status: 'ignored' });
    }

    const text = body.message.text;
    const photo = body.message.photo?.[0]?.file_id;
    
    // Создаем пост
    await createPost(text, photo);

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 