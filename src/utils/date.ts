export const formatDate = (date: Date | number): string => {
  // Проверяем, является ли входное значение числом (timestamp)
  const dateObj = typeof date === 'number' ? new Date(date * 1000) : date;
  
  // Проверяем валидность даты
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Дата не указана';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(dateObj);
}; 