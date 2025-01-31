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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type BannerType = {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  created_at: string;
  index_num: number;
};

const fetcher = async ([session, u]: [Session, string]) => {
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<BannerType[]>;
};

export default function Page() {
  const session = useSession();
  const infinite = useSWRInfinite(
    (index, previousPageData: BannerType[]) => {
      if (previousPageData && !previousPageData.length) return;
      if (index == 0) {
        return [session, endpoint('/v1/banner/list/')];
      }
      const lastHead = previousPageData.reduce((p, c) => (p.id > c.id ? p : c));

      return [
        session,
        `${endpoint(`/v1/banner/`)}?offset=${index == 0 ? 0 : lastHead.id}`,
      ];
    },
    {
      fetcher: fetcher,
    },
  );
  const [page, setPage] = useState(0);
  const [updatingIndex, setUpdatingIndex] = useState(-1);
  const [createBody, setCreateBody] = useState({
    Title: '',
    File: null as File | null,
    LinkURL: '',
    index_num: 0,
  });
  const [updateBody, setUpdateBody] = useState<{
    Title?: string;
    File?: File | null;
    LinkURL?: string;
    index_num?: number;
  }>({
    Title: '',
    File: null,
    LinkURL: '',
    index_num: 0,
  });

  const deleteBanner = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }
    const response = await authFetch(
      session,
      endpoint(`/v1/banner/delete/${id}`),
      {
        method: 'POST',
      },
    );
    if (response.ok) {
      toast.success('배너를 삭제했습니다');
    } else {
      toast.error('배너 삭제에 실패했습니다');
    }
  };

  const uploadBanner = async () => {
    const formData = new FormData();
    formData.append('Title', createBody.Title);
    if (createBody.File) {
      formData.append('file', createBody.File);
    }
    formData.append('LinkURL', createBody.LinkURL);
    formData.append('IndexNum', createBody.index_num.toString());

    const response = await authFetch(session, endpoint(`/v1/banner/upload`), {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast.success('배너를 생성했습니다');
    } else {
      toast.error('배너 생성에 실패했습니다');
    }
  };

  const updateBanner = async (id: number) => {
    if (!confirm('정말로 수정하시겠습니까?')) {
      return;
    }
    const formData = new FormData();
    if (updateBody.Title) {
      formData.append('Title', updateBody.Title);
    }
    if (updateBody.File) {
      formData.append('file', updateBody.File);
    }
    if (updateBody.LinkURL) {
      formData.append('LinkURL', updateBody.LinkURL);
    }
    if (updateBody.index_num) {
      formData.append('IndexNum', updateBody.index_num.toString());
    }

    const response = await authFetch(
      session,
      endpoint(`/v1/banner/update/${id}`),
      {
        method: 'POST',
        body: formData,
      },
    );

    if (response.ok) {
      toast.success('배너를 수정했습니다');
    } else {
      toast.error('배너 수정에 실패했습니다');
    }
  };

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
            <TableHead>ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead>연결</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>순서</TableHead>
            <TableHead>행동</TableHead>
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
                <TableCell>
                  {updatingIndex == it.id ? (
                    <Input
                      value={updateBody.Title}
                      onChange={(e) =>
                        setUpdateBody((u) => ({ ...u, Title: e.target.value }))
                      }
                    />
                  ) : (
                    it.title
                  )}
                </TableCell>
                <TableCell>
                  {updatingIndex == it.id ? (
                    <Input
                      type="file"
                      onChange={(e) =>
                        setUpdateBody((u) => ({
                          ...u,
                          File: e.target.files ? e.target.files[0] : null,
                        }))
                      }
                    />
                  ) : (
                    it.image_url
                  )}
                </TableCell>
                <TableCell>
                  {updatingIndex == it.id ? (
                    <Input
                      value={updateBody.LinkURL}
                      onChange={(e) =>
                        setUpdateBody((u) => ({
                          ...u,
                          LinkURL: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    it.link_url
                  )}
                </TableCell>
                <TableCell>{it.created_at}</TableCell>
                <TableCell>
                  {updatingIndex == it.id ? (
                    <Input
                      type="number"
                      value={updateBody.index_num}
                      onChange={(e) =>
                        setUpdateBody((u) => ({
                          ...u,
                          index_num: +e.target.value,
                        }))
                      }
                    />
                  ) : (
                    it.index_num
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (updatingIndex === it.id) {
                        updateBanner(it.id);
                        setUpdatingIndex(-1);
                        return;
                      }
                      setUpdatingIndex(it.id);
                    }}
                  >
                    수정
                  </Button>
                  {updatingIndex !== it.id && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        deleteBanner(it.id);
                      }}
                    >
                      삭제
                    </Button>
                  )}
                  {updatingIndex === it.id && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setUpdatingIndex(-1);
                      }}
                    >
                      취소
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          {/* upload */}
          <TableRow>
            <TableCell>+</TableCell>
            <TableCell>
              <Input
                value={createBody.Title}
                onChange={(e) =>
                  setCreateBody((u) => ({ ...u, Title: e.target.value }))
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="file"
                onChange={(e) =>
                  setCreateBody((u) => ({
                    ...u,
                    File: e.target.files ? e.target.files[0] : null,
                  }))
                }
              />
            </TableCell>
            <TableCell>
              <Input
                value={createBody.LinkURL}
                onChange={(e) =>
                  setCreateBody((u) => ({ ...u, LinkURL: e.target.value }))
                }
              />
            </TableCell>
            <TableCell>현재 시각</TableCell>
            <TableCell>
              <Input
                type="number"
                value={createBody.index_num}
                onChange={(e) =>
                  setCreateBody((u) => ({ ...u, index_num: +e.target.value }))
                }
              />
            </TableCell>
            <TableCell>
              <Button size="sm" variant="secondary" onClick={uploadBanner}>
                생성
              </Button>
            </TableCell>
          </TableRow>
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
