import { PostPreview } from '@/types/post';
import { formatDate } from '@/utils/date';

function splitTitleBody(text: string) {
  const dotIdx = text.indexOf('.') !== -1 ? text.indexOf('.') : text.length;
  return {
    title: text.slice(0, dotIdx + 1).trim(),
    body: text.slice(dotIdx + 1).trim(),
  };
}

export const SmallPostCard = ({ post }: { post: PostPreview }) => {
  const { title, body } = splitTitleBody(post.title);
  return (
    <div className="flex items-center mb-2 rounded-lg bg-white shadow px-2 py-2">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={title} className="w-16 h-16 object-cover rounded mr-3" />
      )}
      <div className="flex-1">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="text-xs text-gray-600">{body}</p>
        <div className="text-xs text-gray-400">{formatDate(post.publishedAt)}</div>
      </div>
    </div>
  );
}; 