'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useSWRInfinite from 'swr/infinite';
import { MarketProductWithShortUser } from '@/api/types';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { useSession, useUser } from '@/api/surge';
import { Session } from '@entropi-co/surge-js';
import { CreateProductButton } from '@/app/dashboard/(panels)/products/create-product-button';

const fetcher = async ([session, u]: [Session, string]) => {
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<MarketProductWithShortUser[]>;
};

export default function Page() {
  const session = useSession();
  const user = useUser();
  const infinite = useSWRInfinite(
    (index, previousPageData: MarketProductWithShortUser[]) => {
      if (previousPageData && !previousPageData.length) return;
      if (index == 0) {
        return [session, endpoint('/v1/products/')];
      }
      const lastProduct = previousPageData.reduce((p, c) =>
        p.id > c.id ? p : c,
      );

      return [
        session,
        `${endpoint(`/v1/products/`)}?creator=${user?.id}&offset=${index == 0 ? 0 : lastProduct.id}`,
      ];
    },
    {
      fetcher: fetcher,
    },
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (page > infinite.size) {
      void infinite.setSize(page);
    }
  }, [page]);

  return (
    <>
      <CreateProductButton />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>업로더</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>설명</TableHead>
            <TableHead>상품 생성</TableHead>
            <TableHead>상품 업데이트</TableHead>
            <TableHead>이미지</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {infinite.data &&
            (infinite.size >= page
              ? infinite.data[page]
                ? infinite.data[page]
                : []
              : []
            ).map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.id}</TableCell>
                <TableCell>{it.creator.nickname ?? it.creator.id}</TableCell>
                <TableCell>{it.name}</TableCell>
                <TableCell>{it.description}</TableCell>
                <TableCell>{it.created_at.toLocaleString()}</TableCell>
                <TableCell>{it.updated_at.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination className="mt-auto border-t pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => p - 1)}
              text="이전"
              isActive={page != 0}
            />
          </PaginationItem>
          {page != 0 && (
            <PaginationItem>
              <PaginationLink href="#">{page}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => setPage((p) => p + 1)}>
              {page + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => p + 1)}
              text="다음"
              isActive={infinite.data && infinite.data[page]?.length > 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
