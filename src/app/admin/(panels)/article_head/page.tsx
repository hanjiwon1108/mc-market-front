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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { set } from 'lodash';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type HeadType = {
  id: number;
  name: string;
};

const fetcher = async ([session, u]: [Session, string]) => {
  if (!session) return [];
  const it = await authFetch(session, u);
  return (await it.json()) as Promise<HeadType[]>;
};

export default function Page() {
  const session = useSession();
  const infinite = useSWRInfinite(
    (index, previousPageData: HeadType[]) => {
      if (previousPageData && !previousPageData.length) return;
      if (index == 0) {
        return [session, endpoint('/v1/article_head/list/')];
      }
      const lastHead = previousPageData.reduce((p, c) => (p.id > c.id ? p : c));

      return [
        session,
        `${endpoint(`/v1/article_head/`)}?offset=${index == 0 ? 0 : lastHead.id}`,
      ];
    },
    {
      fetcher: fetcher,
    },
  );
  const [page, setPage] = useState(0);
  const [updatingHeadId, setUpdatingHeadId] = useState<number | null>(null);
  const [headName, setHeadName] = useState<string>('');
  const [isCreatingHead, setIsCreatingHead] = useState<boolean>(false);

  useEffect(() => {
    if (page > infinite.size) {
      void infinite.setSize(page);
    }
  }, [page]);

  const deleteHead = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?') == false) {
      return;
    }

    const response = await authFetch(
      session,
      endpoint(`/v1/article_head/delete/${id}/`),
      {
        method: 'POST',
      },
    );

    if (!response.ok) {
      toast.error('삭제 실패');
    } else {
      toast.success('삭제 성공');
    }
  };

  const updateHead = async (id: number) => {
    if (headName === '') {
      toast.error('말머리 이름을 입력해주세요');
      return;
    }

    if (confirm('정말 수정하시겠습니까?') == false) {
      return;
    }

    const response = await authFetch(
      session,
      endpoint(`/v1/article_head/update/${id}/`),
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: headName,
        }),
      },
    );

    if (!response.ok) {
      toast.error('수정 실패');
    } else {
      toast.success('수정 성공');
      setUpdatingHeadId(null);
    }
  };

  const createHead = async () => {
    if (headName === '') {
      toast.error('말머리 이름을 입력해주세요');
      return;
    }

    if (confirm('정말 추가하시겠습니까?') == false) {
      return;
    }

    const formData = new FormData();
    formData.append('Name', headName);

    const response = await authFetch(session, endpoint(`/v1/article_head/`), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      toast.error('추가 실패');
    } else {
      toast.success('추가 성공');
      setIsCreatingHead(false);
      setHeadName('');
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>말머리 이름</TableHead>
            <TableHead>수정/삭제</TableHead>
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
                  {updatingHeadId !== it.id ? (
                    it.name
                  ) : (
                    <Input
                      value={headName}
                      onChange={(e) => setHeadName(e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {(updatingHeadId === null || updatingHeadId === it.id) && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (
                          isCreatingHead &&
                          !confirm('새로운 말머리를 만들지 않습니까?')
                        ) {
                          return;
                        }

                        if (updatingHeadId === null) {
                          setIsCreatingHead(false);
                          setUpdatingHeadId(it.id);
                          setHeadName(it.name);
                          return;
                        }

                        updateHead(it.id);
                      }}
                    >
                      수정
                    </Button>
                  )}
                  {updatingHeadId === it.id && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setUpdatingHeadId(null);
                      }}
                    >
                      취소
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      deleteHead(it.id);
                    }}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              {!isCreatingHead ? (
                <Button
                  onClick={() => {
                    if (
                      updatingHeadId &&
                      confirm('수정 사항을 적용하시지 않겠습니까?') == false
                    ) {
                      return;
                    }
                    setHeadName('');
                    setUpdatingHeadId(null);
                    setIsCreatingHead(true);
                  }}
                  variant="secondary"
                  size="sm"
                >
                  말머리 추가 하기
                </Button>
              ) : (
                <Input placeholder="말머리 이름" onValueChange={setHeadName} />
              )}
              {isCreatingHead && (
                <TableCell>
                  <Button
                    onClick={() => {
                      createHead();
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    추가
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreatingHead(false);
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    취소
                  </Button>
                </TableCell>
              )}
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
