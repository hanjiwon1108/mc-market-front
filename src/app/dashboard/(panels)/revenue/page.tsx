'use client';

import useSWR from 'swr';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { Fragment } from 'react';
import Image from 'next/image';

export default function Page() {
  const session = useSession();
  const revenues = useSWR(
    endpoint(`/v1/user/revenues`),
    (u) =>
      session &&
      authFetch(session, u)
        .then(
          (it) =>
            it.json() as Promise<
              {
                product_id: string;
                product_name: string;
                product_price: number;
                product_discount: number | null;
                purchased_at: string;
                cost: number;
              }[]
            >,
        )
        .then((data) => {
          return Array.from(
            data
              .reduce(
                (map, item) => {
                  if (map.has(item.product_id)) {
                    const existing = map.get(item.product_id)!;
                    // Merge costs
                    existing.cost += item.cost;
                  } else {
                    // Add new entry to the map
                    map.set(item.product_id, { ...item });
                  }
                  return map;
                },
                new Map<
                  string,
                  {
                    product_id: string;
                    product_name: string;
                    product_price: number;
                    product_discount: number | null;
                    purchased_at: string;
                    cost: number;
                  }
                >(),
              )
              .values(),
          );
        }),
  );

  return (
    <div>
      <Table className="w-full min-w-0 max-w-full overflow-x-scroll">
        <TableHeader>
          <TableRow>
            <TableHead>상품 ID</TableHead>
            <TableHead>이미지</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>가격(할인)</TableHead>
            <TableHead>미정산금</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenues.data?.map((row) => (
            <TableRow key={row.product_id}>
              <TableCell className="w-min">{row.product_id}</TableCell>
              <TableCell className="mx-auto my-2 mr-4 flex h-16 max-w-40 items-center justify-center rounded-2xl bg-accent">
                <Image
                  src={endpoint(`/v1/products/${row.product_id}/image`)}
                  height={32}
                  width={32}
                  alt="Product Image"
                />
              </TableCell>
              <TableCell>{row.product_name}</TableCell>
              <TableCell>
                {row.product_price}{' '}
                {row.product_discount && ` (${row.product_discount})`}
              </TableCell>
              <TableCell>{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
