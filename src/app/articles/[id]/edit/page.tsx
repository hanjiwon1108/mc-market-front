'use client';

import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import WriteComponent from '@/components/article/write';
import { useEffect, useState } from 'react';
import { ResponseCommentType } from '@/api/types/comment';

type ArticleAuthor = {
  id: string;
  username: string;
  nickname?: string; // Optional property
};

type GetArticleResponse = {
  id: string;
  title: string;
  content: string;
  author: ArticleAuthor;
  created_at: string; // ISO 8601 formatted date string
  updated_at: string; // ISO 8601 formatted date string
  views: number;
  comments: ResponseCommentType;
  likes: number;
  dislikes: number;
  head: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  const session = useSession();
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [head, setHead] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function getArticle() {
    const { id } = await params;
    setId(id);

    const response = await fetch(endpoint(`/v1/articles/${id}`));
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    const article: GetArticleResponse = await response.json();

    setTitle(article.title);
    setContent(article.content);
    setHead(article.head);
  }

  async function upload(title: string, content: string, head: string) {
    if (head === '') {
      toast.error('말머리를 선택해주세요');
      return;
    }
    setUploading(true);

    const response = await authFetch(session, endpoint(`/v1/articles/${id}`), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        head,
      }),
    });

    if (!response.ok) {
      toast.error('업로드 실패');
    } else {
      router.push('/articles/');
    }

    setUploading(false);
  }

  useEffect(() => {
    getArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {title !== '' && content !== '' && head !== '' && (
        <WriteComponent
          upload={upload}
          uploading={uploading}
          content={content}
          head={head}
          title={title}
        />
      )}
    </>
  );
}
