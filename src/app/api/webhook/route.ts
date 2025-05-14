import { NextResponse } from 'next/server';
import { Bot } from 'grammy';
import { processNewMessage } from '@/services/telegram';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    if (update.channel_post) {
      await processNewMessage(update.channel_post);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ошибка при обработке webhook:', error);
    return NextResponse.json(
      { error: 'Не удалось обработать webhook' },
      { status: 500 }
    );
  }
} 