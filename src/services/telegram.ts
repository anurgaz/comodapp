import { Bot } from 'grammy';
import type { Message } from 'grammy/types';
import { TELEGRAM_CHANNELS, MINI_APP_USERNAME, MINI_APP_CONFIG } from '@/config/channels';
import { Post, PostPreview } from '@/types/post';
import { createPost } from './database';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

// Инициализация Мини-приложения
bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Запустить бота'
  }
]);

export async function getChannelPosts(
  username: string,
  page: number,
  limit: number
): Promise<{ posts: PostPreview[]; total: number }> {
  try {
    const chat = await bot.api.getChat(`@${username}`);
    
    const messages = await bot.api.getUpdates({
      offset: (page - 1) * limit,
      limit,
      allowed_updates: ['channel_post']
    });

    const posts = messages
      .filter(update => update.channel_post?.chat.username === username)
      .map(update => {
        const message = update.channel_post as Message;
        const photo = message.photo?.[0];
        return {
          id: `${username}-${message.message_id}`,
          title: message.text?.split('\n')[0] || 'Без заголовка',
          subtitle: message.text?.split('\n')[1] || 'Без подзаголовка',
          imageUrl: photo ? `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/photos/${photo.file_id}` : undefined,
          publishedAt: message.date
        };
      });

    return {
      posts,
      total: await bot.api.getChatMemberCount(`@${username}`)
    };
  } catch (error) {
    console.error('Ошибка при получении постов канала:', error);
    throw error;
  }
}

export async function getPost(username: string, messageId: number): Promise<Post> {
  try {
    const chat = await bot.api.getChat(`@${username}`);
    const updates = await bot.api.getUpdates({
      offset: -1,
      limit: 1,
      allowed_updates: ['channel_post']
    });
    
    const channelPost = updates.find(update => 
      update.channel_post?.chat.username === username && 
      update.channel_post.message_id === messageId
    )?.channel_post;

    if (!channelPost) {
      throw new Error('Пост не найден');
    }

    const photo = channelPost.photo?.[0];

    return {
      id: `${username}-${messageId}`,
      title: channelPost.text?.split('\n')[0] || 'Без заголовка',
      subtitle: channelPost.text?.split('\n')[1] || 'Без подзаголовка',
      body: channelPost.text || 'Нет содержимого',
      imageUrl: photo ? `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/photos/${photo.file_id}` : undefined,
      publishedAt: channelPost.date,
      channelId: username,
      messageId
    };
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    throw error;
  }
}

export async function shouldProcessMessage(message: Message): Promise<boolean> {
  if (!message.text) return false;
  
  // Проверяем, содержит ли сообщение имя мини-приложения или данные веб-приложения
  return message.text.includes(`@${MINI_APP_USERNAME}`) || 
         message.web_app_data !== undefined;
}

export async function processNewMessage(message: Message): Promise<void> {
  if (!await shouldProcessMessage(message)) return;

  try {
    // Проверяем, что это пост из канала
    if (message.chat?.type === 'channel') {
      const channelUsername = message.chat.username;
      if (!channelUsername) {
        console.error('Не удалось получить username канала');
        return;
      }

      // Формируем пост для веб-приложения
      const photo = message.photo?.[0];
      const post: Post = {
        id: `${channelUsername}-${message.message_id}`,
        title: message.text?.split('\n')[0] || 'Без заголовка',
        subtitle: message.text?.split('\n')[1] || 'Без подзаголовка',
        body: message.text || 'Нет содержимого',
        imageUrl: photo ? `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/photos/${photo.file_id}` : undefined,
        publishedAt: message.date,
        channelId: channelUsername,
        messageId: message.message_id
      };

      // Сохраняем пост в базу данных
      await createPost(post);
      console.log('Новый пост сохранен в базу данных:', post);

      // Отправляем подтверждение в канал
      await bot.api.sendMessage(message.chat.id, '✅ Пост успешно опубликован в веб-приложении');
    }
  } catch (error) {
    console.error('Ошибка при обработке поста:', error);
    // Отправляем сообщение об ошибке в канал
    if (message.chat?.type === 'channel') {
      await bot.api.sendMessage(message.chat.id, '❌ Произошла ошибка при публикации поста');
    }
  }
} 