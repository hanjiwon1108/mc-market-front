'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { endpoint } from '@/api/market/endpoint';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ITEMS_PER_PAGE = 10;
const MAX_PAGINATION_ITEMS = 10;

interface ArticleElement {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  head?: string;
  views: number;
  has_img: boolean;
  author: {
    id: string;
    username: string;
    nickname?: string;
  };
  comment_count: number;
  likes: number;
}

// Comment out dummy data generator
/*
const generateDummyArticles = (count: number): Article[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Article ${i + 1}`,
    excerpt: `This is a short excerpt for article ${i + 1}. It gives a brief overview of the content.`
  }))
}

const TOTAL_ARTICLES = 57
const dummyArticles = generateDummyArticles(TOTAL_ARTICLES)
*/

type HeadType = {
  id: number;
  name: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ArticleList() {
  const router = useRouter();
  const headId = parseInt(useSearchParams().get('head') || '0');

  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const articles = useSWR<ArticleElement[]>(
    endpoint(`/v1/articles`) +
      `?offset=${offset}&limit=${ITEMS_PER_PAGE}&head_id=${headId}`,
    fetcher,
  );

  const totalArticles = useSWR<number>(endpoint('/v1/articles/count'), fetcher);
  const articleHeads = useSWR<HeadType[]>(
    endpoint('/v1/article_head/list'),
    fetcher,
  );

  if (articles.error || totalArticles.error)
    return <div>Failed to load articles</div>;
  if (articles.isLoading || totalArticles.isLoading)
    return <div>Loading...</div>;

  const totalPages = Math.ceil((totalArticles.data || 0) / ITEMS_PER_PAGE);
  const articleHeadsData = articleHeads.data;

  const generatePagination = () => {
    let start = Math.max(1, page - Math.floor(MAX_PAGINATION_ITEMS / 2));
    const end = Math.min(totalPages, start + MAX_PAGINATION_ITEMS - 1);

    if (end - start + 1 < MAX_PAGINATION_ITEMS) {
      start = Math.max(1, end - MAX_PAGINATION_ITEMS + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginationItems = generatePagination();

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
    <div className="overflow-hidden">
      <div
        className="flex scroll-p-0 gap-2 overflow-x-scroll px-4 pb-2 scrollbar-hide"
        id="heads"
      >
        <Button
          onClick={() => {
            router.push('/articles');
          }}
          className={'bg-gray-200 ' + (headId === 0 ? ' bg-blue-400' : '')}
        >
          전체
        </Button>
        {articleHeadsData?.map((head) => (
          <Button
            key={head.id}
            onClick={() => {
              router.push(`/articles?head=${head.id}`);
            }}
            className={head.id === headId ? 'bg-blue-400' : 'bg-gray-200'}
          >
            {head.name}
          </Button>
        ))}
      </div>
      {/* PC 버전 */}
      {!isMobile && (
        <Table className="w-full min-w-0 max-w-full overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>말머리</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>조회</TableHead>
              <TableHead>추천</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.data?.map((article) => (
              <TableRow
                onClick={() => router.push(`/articles/${article.id}`)}
                className={
                  'cursor-pointer' +
                  (article.head === '공지' ? ' font-bold' : '')
                }
                key={article.id}
              >
                <TableCell className="text-center">
                  {article.head === '' ? '일반' : article.head}
                </TableCell>
                <TableCell className={'w-full'}>
                  <em
                    style={{
                      background:
                        "url('https://nstatic.dcinside.com/dc/w/images/sp/icon_img.png?1012')",
                      display: 'inline-block',
                      width: '15px',
                      height: '15px',
                      verticalAlign: '-3px',
                      marginRight: '7px',
                      backgroundPosition:
                        article.head === '공지'
                          ? '0px 0px'
                          : !article.has_img
                            ? '0px -123px'
                            : '0px -100px',
                    }}
                  ></em>
                  {article.title} [{article.comment_count}]
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {article.author.nickname ?? `@${article.author.username}`}
                </TableCell>
                <TableCell>
                  <div className="ml-auto w-min whitespace-nowrap">
                    {getTime(article.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-center">{article.views}</TableCell>
                <TableCell className="text-center">{article.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* 모바일 버전 */}
      {isMobile && (
        <div className="flex flex-col justify-center border-y border-gray-200">
          {articles.data?.map((article) => (
            <div
              key={article.id}
              className="flex cursor-pointer justify-between border border-gray-200 px-4"
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <div className="py-2">
                <div>
                  <em
                    style={{
                      background:
                        "url('https://nstatic.dcinside.com/dc/w/images/sp/icon_img.png?1012')",
                      display: 'inline-block',
                      width: '15px',
                      height: '15px',
                      verticalAlign: '-3px',
                      marginRight: '7px',
                      backgroundPosition: !article.has_img
                        ? '0px -123px'
                        : '0px -100px',
                    }}
                  ></em>
                  {article.title}
                </div>
                <div className="flex gap-1 text-sm text-gray-600">
                  <span>{article.head === '' ? '일반' : article.head}</span>|
                  <span>{article.author.nickname}</span>|
                  <span>{getTime(article.created_at)}</span>|
                  <span>조회 {article.views}</span>|
                  <span>추천 {article.likes}</span>
                </div>
              </div>
              <div className="flex w-5 items-center justify-center border-l-2 pl-2 text-red-600">
                <span>{article.comment_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* 페이지네이션 */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="기존"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {paginationItems[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {paginationItems[0] > 2 && <PaginationEllipsis />}
              </>
            )}
            {paginationItems.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            {paginationItems[paginationItems.length - 1] < totalPages && (
              <>
                {paginationItems[paginationItems.length - 1] <
                  totalPages - 1 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                text="다음"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="mt-2 text-center text-sm text-gray-600">
        전체 아티클: {totalArticles.data}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="flex">
        <h1 className="mb-6 text-3xl font-bold">게시판</h1>
        <Button
          className="ml-auto"
          onClick={() => router.push(`/articles/write`)}
        >
          업로드
        </Button>
      </div>
      <ArticleList />
    </div>
  );
}
