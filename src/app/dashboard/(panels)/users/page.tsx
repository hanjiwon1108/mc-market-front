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
import {Session} from "@entropi-co/surge-js";

function getKey(index: number, previousPageData: MarketUser[]) {
  // if (index == 0) return endpoint('/v1/user');
  // return endpoint(`/v1/user`) + `?offset=${lastUser.id}`;
}

const fetcher = async ([session, u]: [Session, string]) => {
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<MarketUser[]>;
}

export default function Page() {
  const session = useSession();
  const infinite = useSWRInfinite(
    (index, previousPageData: MarketUser[]) => {
      if (previousPageData && !previousPageData.length) return;
      if(index == 0) {
        return [session, endpoint('/v1/user/')]
      }
      const lastUser = previousPageData.reduce((p, c) => (p.id > c.id ? p : c));

      return [
        session,
        `${endpoint(`/v1/user/`)}?offset=${index == 0 ? 0 : lastUser.id}`,
      ];
    },
      {
        fetcher: fetcher,
      }
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
            (infinite.size >= page ? (infinite.data[page] ? infinite.data[page] : []) : []).map((it) => (
                <TableRow key={it.id}>
                  <TableHead>{it.id}</TableHead>
                  <TableHead>{it.nickname}</TableHead>
                  <TableHead>{it.created_at.toLocaleString()}</TableHead>
                  <TableHead>{it.updated_at.toLocaleString()}</TableHead>
                  <TableHead>{it.permissions}</TableHead>
                </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination className="mt-auto border-t pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(p => p-1)} text="이전" isActive={page != 0} />
          </PaginationItem>
          {page != 0 && <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>}
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {page+1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => setPage(p => p+1)}>{page+2}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => setPage(p => p+1)} text="다음" isActive={infinite.data && infinite.data[page]?.length > 0}/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
