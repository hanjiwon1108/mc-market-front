import { useSession } from '@/api/surge';
import { Comment } from '@/api/types/comment';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserAvatar } from '../user/avatar';

export default function Comments({
  comment,
  child,
  delComment,
  setReplyTo,
  setCommentText,
}: {
  comment: Comment;
  child: number;
  delComment: (id: string) => void;
  setCommentText: (text: string) => void;
  setReplyTo: (id: string) => void;
}) {
  const isMobile = useIsMobile();
  const session = useSession();

  const getTime = (date: string) => {
    // yyyy. mm. dd. hh:mm:ss 형식으로 변환
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date(date);
    const today = new Date();
    const year = new Date().getFullYear();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    const isThisYear = d.getFullYear() === year;

    return !isToday
      ? `${!isThisYear ? d.getFullYear().toString().slice(-2) + '.' : ''}${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
      : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div
      key={comment.id}
      className={
        'mx-auto flex flex-col items-center' + (child === 1 ? ' pl-4' : '')
      }
    >
      <div
        className={
          'flex w-11/12 justify-between border-b border-gray-400 px-2 py-2' +
          (child ? ' bg-gray-200 dark:bg-gray-900' : '')
        }
      >
        <div
          className={
            `flex w-full cursor-pointer justify-between` +
            (isMobile ? ` flex-col` : ` space-x-4`)
          }
          onClick={() => {
            setReplyTo(comment.id);
            setCommentText(comment.content);
          }}
        >
          <div className="flex gap-1 space-y-1">
            <UserAvatar userId={comment.user.id} size={isMobile ? 6 : 8} />
            <span
              className="flex w-20 items-center pl-1 font-medium text-gray-800 dark:text-gray-200"
              style={{ marginTop: isMobile ? '0px' : '3px' }}
            >
              {comment.user.nickname || comment.user.nickname}
            </span>
          </div>
          <p
            className={
              'flex items-center justify-start ' +
              (isMobile ? 'w-full' : 'w-10/12')
            }
          >
            {child ? '└ ' : ''}
            {comment.content}
          </p>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getTime(comment.created_at)}
            </span>
            {comment.updated_at != comment.created_at && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                업데이트: {getTime(comment.updated_at)}
              </span>
            )}
          </div>
        </div>
        {comment.user.id === session?.user.id && (
          <div className="flex w-10 flex-col space-y-1">
            <button
              onClick={() => delComment(comment.id)}
              className="text-red-500 dark:text-red-400"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      {comment.replies && (
        <div className="w-full">
          {comment.replies?.map((reply) => (
            <Comments
              key={reply.id}
              comment={reply}
              child={child + 1}
              setReplyTo={setReplyTo}
              delComment={delComment}
              setCommentText={setCommentText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
