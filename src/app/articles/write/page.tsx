'use client';

import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import WriteComponent from '@/components/article/write';
import { useState } from 'react';

export default function Page() {
  const session = useSession();
  const [title, content, head] = ['', '', ''];
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function upload(
    title: string,
    content: string,
    head: string,
    comment_disabled: boolean,
    like_disabled: boolean,
  ) {
    if (head === '') {
      toast.error('말머리를 선택해주세요');
      return;
    }
    setUploading(true);

    const response = await authFetch(session, endpoint('/v1/articles'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        head,
        comment_disabled,
        like_disabled,
      }),
    });

    if (!response.ok) {
      toast.error('업로드 실패');
    } else {
      router.push('/articles/');
    }

    setUploading(false);
  }

  return (
    <WriteComponent
      upload={upload}
      uploading={uploading}
      content={content}
      head={head}
      title={title}
    />
  );
}
