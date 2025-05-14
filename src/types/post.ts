export interface Post {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
  publishedAt: number; // Unix timestamp
  channelId: string;
  messageId: number;
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