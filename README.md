# Telegram Channel CMS

Веб-приложение для управления контентом через Telegram канал. Позволяет публиковать посты в канале и автоматически отображать их на сайте.

## Технологии

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- Telegram Bot API

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/scrn?schema=public"
TELEGRAM_BOT_TOKEN="your_bot_token"
```

4. Примените миграции:
```bash
npx prisma migrate dev
```

5. Запустите приложение:
```bash
npm run dev
```

## Использование

1. Добавьте бота в канал как администратора
2. Публикуйте посты в канале с упоминанием бота (@comodapp)
3. Посты автоматически появятся на сайте

## Разработка

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm start` - запуск production версии
