'use client';

import { endpoint } from '@/api/market/endpoint';
import { useSession } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LikeComponent({
  likesOrigin,
  dislikesOrigin,
  articleId,
}: {
  likesOrigin: number;
  dislikesOrigin: number;
  articleId: string;
}) {
  const session = useSession();
  const [likes, setLikes] = useState(likesOrigin);
  const [dislikes, setDislikes] = useState(dislikesOrigin);

  type GetLikesAndDisLikesType = {
    dislikes: number;
    likes: number;
  };
  const getLikesAndDisLikes = async () => {
    // 추천 API 호출
    const response = await fetch(endpoint(`v1/article_likes/${articleId}/`));
    if (!response.ok) {
      toast.error('실패');
      return;
    }
    const data: GetLikesAndDisLikesType = await response.json();
    setLikes(data.likes);
    setDislikes(data.dislikes);
  };

  const sendTypeOfLike = async (like: boolean) => {
    // 추천/비추천 API 호출
    if (!session) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const response = await authFetch(
      session,
      endpoint(`v1/article_likes/${articleId}/`),
      {
        method: 'POST',
        body: JSON.stringify({ like }),
      },
    );

    if (!response.ok) {
      toast.error('실패');
      return;
    }

    getLikesAndDisLikes();
  };
  return (
    <div className="flex w-full justify-center gap-4">
      <button
        className="flex flex-col items-center"
        onClick={() => sendTypeOfLike(true)}
      >
        <em
          style={{
            backgroundImage:
              'url(https://nstatic.dcinside.com/dc/w/images/sp/sp_img.png?1112)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 -315px',
            display: 'inline-block',
            width: '56px',
            height: '56px',
          }}
        />
        {likes}
      </button>
      <button
        className="flex flex-col items-center"
        onClick={() => sendTypeOfLike(false)}
      >
        <em
          style={{
            backgroundImage:
              'url(https://nstatic.dcinside.com/dc/w/images/sp/sp_img.png?1112)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 -377px',
            display: 'inline-block',
            width: '56px',
            height: '56px',
          }}
        />
        {dislikes}
      </button>
    </div>
  );
}
