'use client';

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { ProductCard } from '@/components/product/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RangeSlider } from '@/components/ui/range-slider';
import { Checkbox } from '@/components/ui/checkbox';
import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';
import useSWRInfinite from 'swr/infinite';

type OrderByOptions = 'time' | 'price' | 'downloads';
type SortOptions = `asc` | 'desc';

type FilterOptions = {
  orderBy: OrderByOptions;
  sort: SortOptions;
  priceRange: [number, number];
  keywords: string;
};

export function ProductSearch() {
  const [orderBy, setOrderBy] = useState<OrderByOptions>('time');
  const [sort, setSort] = useState<SortOptions>('desc');
  const [filterPriceRange, setFilterPriceRange] = useState([0, 200000]);
  const [keywords, setKeywords] = useState('');

  const products = useSWRInfinite(
    (index, prev: MarketProductWithShortUser[]) => {
      const offset =
        index == 0
          ? 0
          : prev.reduce((p, c) => (BigInt(p.id) < BigInt(c.id) ? c : p));

      return [
        endpoint(`/v1/products`) + `?offset=${offset}&`,
        {
          orderBy,
          sort,
          priceRange: filterPriceRange,
          keywords,
        } as FilterOptions,
      ];
    },
    async function ([url, filter]: [string, FilterOptions]) {
      const searchParams = new URLSearchParams({
        order_by: filter.orderBy,
        sort: filter.sort,
        price_range_start: `${filter.priceRange[0]}`,
        price_range_end: `${filter.priceRange[1]}`,
      });

      if (filter.keywords.trim() != '') {
        searchParams.set('keyword', filter.keywords);
      }

      return fetch(url + searchParams).then((response) =>
        response.ok
          ? (response.json() as Promise<MarketProductWithShortUser[]>)
          : null,
      );
    },
  );

  return (
    <div className="container mx-auto mt-8 lg:px-[5.75rem]">
      <div className="flex items-center gap-4 p-6">
        <p className="w-20 text-3xl font-semibold">검색</p>
        <Input
          placeholder="키워드 입력"
          value={keywords}
          onValueChange={setKeywords}
        />
      </div>
      <div className="mt-12 flex flex-col gap-4 p-2 md:flex-row">
        <div className="w-full md:w-1/5">
          <div className="flex h-96 w-full flex-col gap-2 rounded-lg bg-accent p-4">
            <p className="text-2xl font-semibold">필터</p>
            <Label htmlFor="search/select:sort">정렬 옵션</Label>
            <Select>
              <SelectTrigger className="w-full" id="search/select:sort">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신 순</SelectItem>
                <SelectItem value="stars">구매 순</SelectItem>
                <SelectItem value="prices">가격 순</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="search/range:price">가격 범위</Label>
            <RangeSlider
              className="mb-8"
              id="search/range:price"
              label={(v) => <div className="whitespace-nowrap">{v}원</div>}
              labelPosition="bottom"
              value={filterPriceRange}
              onValueChange={setFilterPriceRange}
              min={0}
              max={200000}
              step={100}
            />

            <div className="flex items-center space-x-2">
              <Checkbox id="search/checkbox:free" disabled={true} />
              <label
                htmlFor="search/checkbox:free"
                className="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                무료 상품만 보기
              </label>
            </div>
          </div>
        </div>
        {products.data &&
        products.data.length != 0 &&
        products.data[0]?.length != 0 ? (
          <>
            <div className="grid-rows-auto mb-20 grid w-full grid-cols-4 md:w-4/5">
              {products.data
                ?.flatMap((it) => it)
                .map(
                  (it) =>
                    it && (
                      <ProductCard
                        key={it.id}
                        id={it.id}
                        name={it.name}
                        price={it.price}
                        discountPrice={it.price_discount}
                        creatorDisplayName={
                          it.creator.nickname ??
                          `@${it.creator.username}` ??
                          '알 수 없음'
                        }
                      />
                    ),
                )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 select-none items-center justify-center text-3xl font-semibold">
            데이터가 없음
          </div>
        )}
      </div>
    </div>
  );
}
