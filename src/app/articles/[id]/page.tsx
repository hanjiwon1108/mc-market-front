import { endpoint } from '@/api/market/endpoint';
import Markdown from 'react-markdown';
import React from 'react';

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
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const article = await fetch(endpoint(`/v1/articles/${id}`)).then(
    (it) => it.json() as Promise<GetArticleResponse>,
  );

  return (
    <article className="mx-auto w-full px-4 py-8">
      <header className="mb-8 w-full">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          {article.title}
        </h1>
        <div className="flex flex-col space-y-1">
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {article.author.nickname || article.author.username}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(article.created_at).toLocaleString()}
          </span>
          {article.updated_at != article.created_at && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              업데이트: {new Date(article.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </header>
      <hr className="mb-8 border-t border-gray-300 dark:border-gray-700" />
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-headings:text-white dark:prose-p:text-gray-300">
        <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>
    </article>
  );
}
