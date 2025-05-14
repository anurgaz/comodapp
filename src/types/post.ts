export interface Post {
  id: string;
  title: string; // Первое предложение до точки
  body: string;  // Полный текст
  coverImage?: string; // Опциональное изображение
  createdAt: Date;
  updatedAt: Date;
}

export interface PostPreview {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  publishedAt: number; // Unix timestamp
}

export interface PaginationInfo {
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  totalPages: number;
} 