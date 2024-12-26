'use client';

import {
  MAPLE_USER_PERMISSION_ADMINISTRATOR,
  useMapleUserPermission,
} from '@/api/permissions';
import { ErrorScreen } from '@/components/error/error-screen';
import { EditorContent, useEditor } from '@tiptap/react';
import { Markdown, MarkdownStorage } from 'tiptap-markdown';
import { StarterKit } from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function Page() {
  const permission = useMapleUserPermission(
    MAPLE_USER_PERMISSION_ADMINISTRATOR,
  );

  const session = useSession();
  const [title, setTitle] = useState('');
  const editor = useEditor({ extensions: [StarterKit, Markdown] });
  const [uploading, setUploading] = useState(false);

  if (!permission) {
    return (
      <ErrorScreen title="권한 부족">글을 작성할 권한이 없습니다.</ErrorScreen>
    );
  }

  async function upload() {
    if (!editor) return;

    setUploading(true);

    const markdownStorage = editor.storage.markdown as MarkdownStorage;
    const markdown = markdownStorage.getMarkdown();

    const response = await authFetch(session, endpoint('/v1/articles'), {
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: markdown,
      }),
    });

    if (!response.ok) {
      toast.error('업로드 실패');
    }

    setUploading(false);
  }

  return (
    <div className="scrollbar-override flex w-full flex-col gap-2">
      <div className="text-4xl font-semibold">글 작성</div>
      <Input placeholder="제목" value={title} onValueChange={setTitle} />
      <EditorContent
        editor={editor}
        className="prose w-full max-w-full flex-1 overflow-y-scroll rounded-xl px-3 py-1 ring-2 ring-border *:outline-none prose-headings:my-0 prose-p:my-0"
        spellCheck={false}
      />
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
