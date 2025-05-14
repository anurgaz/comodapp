# Vista Comoda Bot

Telegram бот для канала Vista Comoda с интеграцией Mini App.

## Текущее состояние

### Структура поста
- `title`: Первое предложение до точки
- `body`: Полный текст поста
- `coverImage`: Опциональное изображение (file_id от Telegram)
- `createdAt`: Дата создания
- `updatedAt`: Дата обновления

### Конфигурация
- Бот: @vistacomoda_bot
- Mini App URL: https://comodapp.vercel.app
- База данных: PostgreSQL (Supabase)

### Реализованный функционал
1. Webhook для получения сообщений из канала
2. Автоматическое создание постов из сообщений канала
3. API для получения постов
4. Интеграция с Telegram Mini App

### Следующие шаги
1. Проверить работу webhook'а
2. Настроить отображение постов в Mini App
3. Добавить пагинацию для списка постов
4. Реализовать поиск по постам

## Установка и запуск

1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Создать `.env` файл с необходимыми переменными:
   ```
   DATABASE_URL=postgresql://...
   TELEGRAM_BOT_TOKEN=...
   NEXT_PUBLIC_APP_URL=https://comodapp.vercel.app
   ```
4. Запустить миграции: `npx prisma migrate dev`
5. Запустить в режиме разработки: `npm run dev`

## Деплой
Приложение деплоится на Vercel при пуше в main ветку.
