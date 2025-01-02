'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { BasicEditor } from '@/components/editor/basic-editor';
import { ErrorScreen } from '@/components/error/error-screen';
import { useRouter } from 'next/navigation';

export default function Page() {
  const session = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  if (!session) {
    return <ErrorScreen>인증 필요</ErrorScreen>;
  }

  async function upload() {
    setUploading(true);

    const response = await authFetch(session, endpoint('/v1/articles'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
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
    <div className="scrollbar-override flex h-full w-full flex-col gap-2">
      <div className="text-4xl font-semibold">글 작성</div>
      <Input placeholder="제목" value={title} onValueChange={setTitle} />
      <div className="overflow-y-auto">
        <BasicEditor content={content} onContentChange={setContent} />
      </div>
      <Button
        onClick={upload}
        disabled={uploading}
        className="ml-auto w-32 px-6 py-6 text-lg"
      >
        {uploading ? '업로드 중' : '업로드'}
      </Button>
    </div>
  );
}
