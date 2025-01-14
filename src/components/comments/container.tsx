'use client';

import { ResponseCommentType } from '@/api/types/comment';
import Comments from './comments';
import { useEffect, useState } from 'react';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';

export default function CommentsContainer({
  articleId,
  comments: originComments,
}: {
  articleId: string;
  comments: ResponseCommentType;
}) {
  const session = useSession();
  const [comment, setComment] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState(originComments);

  const getComments = async () => {
    const data = await fetch(
      endpoint(`/v1/comment/${articleId}/?page=${page}`),
    ).then((it) => it.json() as Promise<ResponseCommentType>);
    setComments(data);
  };

  const sendComment = async () => {
    // 댓글 작성 API 호출
    if (!session) {
      toast.error('로그인이 필요합니다');
      return;
    }
    if (comment === '') {
      toast.error('댓글을 입력하세요');
      return;
    }
    const formData = new FormData();
    formData.append('Content', comment);
    formData.append('ReplyTo', replyTo);

    const response = await authFetch(
      session,
      endpoint(`v1/comment/${articleId}/`),
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      toast.error('댓글 작성 실패');
      return;
    }

    getComments();
  };

  const delComment = async (id: string) => {
    // 댓글 삭제 API 호출
    if (!session) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const response = await authFetch(
      session,
      endpoint(`v1/comment/${articleId}/${id}`),
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      toast.error('댓글 삭제 실패');
      return;
    }

    getComments();
  };

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <h2 className="mb-4 px-4 text-2xl font-bold text-gray-900 dark:text-white">
        댓글 {comments.count ?? '0'}개
      </h2>
      {comments.comments?.length > 0 &&
        comments.comments.map((comment) => (
          <Comments
            key={comment.id}
            comment={comment}
            setReplyTo={setReplyTo}
            delComment={delComment}
            setCommentText={setCommentText}
            child={0}
          />
        ))}
      <hr className="mb-8 border-t border-gray-300 dark:border-gray-700" />
      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 text-blue-500"
        >
          이전
        </button>
        <span className="px-4 py-2 text-blue-500">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 text-blue-500"
        >
          다음
        </button>
      </div>
      {/* 댓글 작성 칸 */}
      <div className="mx-auto w-full px-4 py-8">
        <div className="flex flex-col space-y-4">
          {replyTo && (
            <div>
              {commentText.slice(0, 30)}
              {commentText.length > 30 ? '...' : ''}에 대한 답글 작성 중
            </div>
          )}
          <textarea
            className="h-32 w-full rounded-md border border-gray-300 p-4 dark:border-gray-700"
            placeholder={session ? '댓글을 입력하세요' : '로그인이 필요합니다'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            onClick={sendComment}
            className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white"
          >
            댓글 작성
          </button>
        </div>
      </div>
    </>
  );
}
