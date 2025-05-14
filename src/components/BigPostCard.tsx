import { PostPreview } from '@/types/post';
import { formatDate } from '@/utils/date';

function splitTitleBody(text: string) {
  const dotIdx = text.indexOf('.') !== -1 ? text.indexOf('.') : text.length;
  return {
    title: text.slice(0, dotIdx + 1).trim(),
    body: text.slice(dotIdx + 1).trim(),
  };
}

export const BigPostCard = ({ post }: { post: PostPreview }) => {
  const { title, body } = splitTitleBody(post.title);
  return (
    <div className="mb-4 rounded-lg overflow-hidden shadow bg-white">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={title} className="w-full h-56 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-2">{body}</p>
        <div className="text-xs text-gray-400">{formatDate(post.publishedAt)}</div>
      </div>
    </div>
  );
}; 