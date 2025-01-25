import { endpoint } from '@/api/market/endpoint';
import React from 'react';
import { ResponseCommentType } from '@/api/types/comment';
import CommentsContainer from '@/components/comments/container';
import LikeComponent from '@/components/article_likes/likecomponent';
import { Metadata, Viewport } from 'next';

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

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(endpoint(`/v1/articles/${id}`));
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  const article: GetArticleResponse = await response.json();

  const deletedTags = article.content.replace(/<[^>]*>?/gm, '');
  const title = `[${article.head || '일반'}] - ${article.title}`;

  return {
    title,
    description: deletedTags.slice(0, 100),
    openGraph: {
      title,
      description: deletedTags.slice(0, 100),
      type: 'article',
      authors: [article.author.nickname || article.author.username],
      url: `https://mc-market.kr/articles/${id}`,
      images: [article.content.match(/<img[^>]*src="([^"]*)"[^>]*>/)?.[1]],
    },
  } as Metadata;
}

export const viewport: Viewport = {
  themeColor: '#00FF80',
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(endpoint(`/v1/articles/${id}`));
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  const article: GetArticleResponse = await response.json();

  const getTime = (date: string) => {
    // yyyy. mm. dd. hh:mm:ss 형식으로 변환
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date(date);
    return (
      `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}. ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  };

  return (
    <div>
      <article className="mx-auto w-full px-4 py-8">
        <header className="mb-4 w-full">
          <h1 className="text-base font-bold text-gray-900 dark:text-white">
            [{article.head ?? '일반'}] | {article.title}
          </h1>
          <div className="flex gap-2 space-y-1">
            <span className="text-md font-medium text-gray-800 dark:text-gray-200">
              {article.author.nickname || article.author.username}
            </span>
            |
            <span className="text-sm text-gray-600 dark:text-gray-400">
              조회수 {article.views}
            </span>
            |
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getTime(article.created_at)}
            </span>
            {/* {article.updated_at != article.created_at && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                업데이트: {getTime(article.updated_at)}
              </span>
            )} */}
          </div>
        </header>
        <hr className="border-t border-gray-300 dark:border-gray-700" />
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-headings:text-white dark:prose-p:text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>
      </article>
      <LikeComponent
        dislikesOrigin={article.dislikes}
        likesOrigin={article.likes}
        articleId={id}
      />
      <CommentsContainer
        comments={article.comments as ResponseCommentType}
        articleId={id}
      />
    </div>
  );
}
