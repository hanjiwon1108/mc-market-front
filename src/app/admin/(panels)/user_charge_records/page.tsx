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
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { Session } from '@entropi-co/surge-js';

type paymentsType = {
  id: number;
  agent: number;
  agent_name: {
    String: string;
    Valid: boolean;
  };
  order_id: string;
  amount: number;
  approved: boolean;
  created_at: string;
  failed: {
    Bool: boolean;
    Valid: boolean;
  };
};

const fetcher = async ([session, u]: [Session, string]) => {
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<paymentsType[]>;
};

export default function Page() {
  const session = useSession();
  const infinite = useSWRInfinite(
    (index, previousPageData: paymentsType[]) => {
      if (previousPageData && !previousPageData.length) return;
      if (index == 0) {
        return [session, endpoint('/v1/payments')];
      }
      const lastRecords = previousPageData.reduce((p, c) =>
        p.id > c.id ? p : c,
      );

      return [
        session,
        `${endpoint(`/v1/payments/`)}?page=${index == 0 ? 0 : lastRecords.id}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>User Id</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Failed</TableHead>
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
                <TableCell>{it.created_at}</TableCell>
                <TableCell>{it.id}</TableCell>
                <TableCell>{it.agent}</TableCell>
                <TableCell>{it.agent_name.String}</TableCell>
                <TableCell>{it.amount}</TableCell>
                <TableCell>{it.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>{it.failed.Bool ? 'Yes' : 'No'}</TableCell>
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
