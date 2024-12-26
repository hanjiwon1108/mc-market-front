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
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;
const MAX_PAGINATION_ITEMS = 10;

interface ArticleElement {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    username: string;
    nickname?: string;
  };
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ArticleList() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const articles = useSWR<ArticleElement[]>(
    endpoint(`/v1/articles`) + `?offset=${offset}&limit=${ITEMS_PER_PAGE}`,
    fetcher,
  );

  const totalArticles = useSWR<number>(endpoint('/v1/articles/count'), fetcher);

  if (articles.error || totalArticles.error)
    return <div>Failed to load articles</div>;
  if (articles.isLoading || totalArticles.isLoading)
    return <div>Loading...</div>;

  const totalPages = Math.ceil((totalArticles.data || 0) / ITEMS_PER_PAGE);

  const generatePagination = () => {
    let start = Math.max(1, page - Math.floor(MAX_PAGINATION_ITEMS / 2));
    const end = Math.min(totalPages, start + MAX_PAGINATION_ITEMS - 1);

    if (end - start + 1 < MAX_PAGINATION_ITEMS) {
      start = Math.max(1, end - MAX_PAGINATION_ITEMS + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginationItems = generatePagination();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>작성자</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>업로드</TableHead>
            <TableHead>업데이트</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.data?.map((article) => (
            <TableRow
              onClick={() => router.push(`/articles/${article.id}`)}
              className="cursor-pointer"
              key={article.id}
            >
              <TableCell>
                {article.author.nickname ?? `@${article.author.username}`}
              </TableCell>
              <TableCell className="w-full">{article.title}</TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(article.created_at).toLocaleString()}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(article.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Articles</h1>
      <ArticleList />
    </div>
  );
}
