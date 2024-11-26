'use client';

import {
  Table,
  TableBody,
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
import { MarketUser } from '@/api/types';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';

function getKey(index: number, previousPageData: MarketUser[]) {
  // if (index == 0) return endpoint('/v1/user');
  // return endpoint(`/v1/user`) + `?offset=${lastUser.id}`;
}

const fetcher = async ([session, u]) => {
  console.log(u);
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<MarketUser[]>;
}

export default function Page() {
  const session = useSession();
  const infinite = useSWRInfinite(
    (index, previousPageData: MarketUser[]) => {
      if (previousPageData && !previousPageData.length) return;
      const lastUser = previousPageData.reduce((p, c) => (p.id > c.id ? p : c));

      return [
        session,
        `${endpoint(`/v1/user/`)}?offset=${index == 0 ? 0 : lastUser.id}`,
      ];
    },
    {
      revalidateFirstPage: false,
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>닉네임</TableHead>
            <TableHead>계정 생성</TableHead>
            <TableHead>마지막 변경</TableHead>
            <TableHead>권한 플래그</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {infinite.data &&
            (infinite.size >= page ? infinite.data[page] : []).map((it) => (
              <>User</>
            ))}
        </TableBody>
      </Table>
      <Pagination className="mt-auto border-t pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="이전" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="다음" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
