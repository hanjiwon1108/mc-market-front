'use client';

import { CATEGORIES, CATEGORY_ALL, TopCategoryKey } from '@/features/category';
import { OptionalLink } from '@/components/util/optional-link';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashed,
  CircleDollarSign,
  CreditCardIcon,
  DownloadIcon,
  PlusIcon,
  ShoppingCartIcon,
  HammerIcon,
  UserIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { MarketProductWithShortUser } from '@/api/types';
import { ChildrenProps } from '@/util/types-props';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { endpoint } from '@/api/market/endpoint';
import { useCart, useIsInCart } from '@/core/cart/atom';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { toast } from 'sonner';
import { ProductPurchaseDialog } from '@/components/product/product-purchase-dialog';
import { FallbackImage } from '@/components/util/fallback-image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserAvatar } from '@/components/user/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const SmallCard = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ChildrenProps & { tooltip?: string }
>(({ children, tooltip, ...props }, ref) => {
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SmallCard {...props}>{children}</SmallCard>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      {...props}
      className={cn(
        'flex w-min items-center gap-2 rounded-xl border px-4 py-2 transition duration-300 hover:bg-accent active:scale-95',
        props.className,
      )}
      ref={ref}
    >
      {children}
    </Button>
  );
});
SmallCard.displayName = 'SmallCard';

const TagCard = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ChildrenProps & { tag?: string }
>((props, ref) => {
  return (
    <SmallCard
      size="sm"
      variant="secondary"
      {...props}
      tooltip={`태그: ${props.tag}`}
      ref={ref}
    />
  );
});
TagCard.displayName = 'TagCard';

function ViewSelect({ url }: { url: string }) {
  return (
    <div className="relative size-32 overflow-hidden rounded-2xl border-2 transition-all hover:border-accent-foreground">
      <FallbackImage
        src={url}
        fill={true}
        className="scale-75 object-contain"
        alt="Product Image"
      />
    </div>
  );
}

function Display({
  name,
  children,
}: ChildrenProps & { name: React.ReactNode }) {
  return (
    <div>
      <div className="text-xl font-semibold">· {name}</div>
      <div className="ml-6 text-lg">{children}</div>
    </div>
  );
}

function useDownload(id: string) {
  const session = useSession();
  const [downloading, setDownloading] = useState(false);
  const response = useRef<Response>();
  const [progress, setProgress] = useState(0);
  const blob = useRef<Blob>();
  const filename = useRef<string>();

  function getFilenameFromContentDisposition(disposition: string): string {
    const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
    const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

    let fileName: string | null = null;
    if (utf8FilenameRegex.test(disposition)) {
      fileName = decodeURIComponent(utf8FilenameRegex.exec(disposition)![1]);
    } else {
      // prevent ReDos attacks by anchoring the ascii regex to string start and
      //  slicing off everything before 'filename='
      const filenameStart = disposition.toLowerCase().indexOf('filename=');
      if (filenameStart >= 0) {
        const partialDisposition = disposition.slice(filenameStart);
        const matches = asciiFilenameRegex.exec(partialDisposition);
        if (matches != null && matches[2]) {
          fileName = matches[2];
        }
      }
    }
    return fileName!;
  }

  function downloadFromCache() {
    if (!blob.current) return;
    const url = URL.createObjectURL(blob.current);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename.current ?? `${id}.market`;
    a.click();
  }

  function startDownload() {
    if (!session || response.current || downloading || blob.current) return;
    setDownloading(true);
    authFetch(session, endpoint(`/v1/products/${id}/file`)).then(async (r) => {
      if (!r.body) {
        setDownloading(false);
        return;
      }

      if (!r.ok) {
        setDownloading(false);
        if (r.status == 404) {
          toast.error(
            <>
              404: 이 상품에 대한 컨텐츠가 없습니다
              <br />
              관리자에게 문의하십시오
            </>,
          );
        } else {
          toast.error(
            `다운로드를 시작할 수 없습니다: ${r.status} ${r.statusText}`,
          );
        }
        return;
      }

      response.current = r;

      filename.current = getFilenameFromContentDisposition(
        r.headers.get('Content-Disposition') ?? '',
      );
      toast.info(`다운로드 큐: ${filename.current}`);

      const contentLength = +(r.headers.get('Content-Length') ?? '0');
      let receivedLength = 0;

      const reader = r.body.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        setProgress(receivedLength / contentLength);
      }

      const concatenated = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        concatenated.set(chunk, position);
        position += chunk.length;
      }

      setDownloading(false);
      blob.current = new Blob([concatenated]);
      downloadFromCache();
    });
  }

  function download() {
    if (blob.current) {
      downloadFromCache();
    } else {
      startDownload();
    }
  }

  return {
    isCacheAvailable: !!blob.current,
    isDownloading: downloading,
    progress,
    download,
  };
}

type ProductDetailProps = {
  onBack?: (() => void) | 'go_to_category' | 'disabled';
  product: MarketProductWithShortUser;
  purchased?: boolean;
};

type ProductUpdateLog = {
  id: number;
  product_id: number;
  title: string;
  content: string;
  update_at: string;
};

type ProductVersion = {
  id: number;
  product_id: number;
  version_name: string;
  link: string;
  index: number;
  updated_at: string;
};

export function ProductDetail({
  onBack,
  product,
  purchased,
}: ProductDetailProps) {
  const category =
    (product &&
      CATEGORIES[product.category?.split('.')[0] as TopCategoryKey]) ??
    CATEGORY_ALL;

  const isInCart = useIsInCart(product.id);
  const { addElement: addToCart, removeElement: removeFromCart } = useCart();

  const download = useDownload(product.id);
  const session = useSession();

  const [isPurchaseOpen, setPurchaseOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [updatingIndex, setUpdatingIndex] = useState(-1);
  const [updateLogs, setUpdateLogs] = useState<ProductUpdateLog[]>([]);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [sendTitle, setSendTitle] = useState('');
  const [sendContent, setSendContent] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [createVersionValues, setCreateVersionValues] =
    useState<ProductVersion>({
      id: 0,
      product_id: 0,
      version_name: '',
      link: '',
      index: 0,
      updated_at: '',
    });
  const [updateVersionValues, setUpdateVersionValues] =
    useState<ProductVersion>({
      id: 0,
      product_id: 0,
      version_name: '',
      link: '',
      index: 0,
      updated_at: '',
    });
  const [versionUpdatingIndex, setVersionUpdatingIndex] = useState(-1);
  const [index, setIndex] = useState(0);

  const getUpdateLog = async () => {
    const res = await fetch(endpoint(`/v1/products_log/list/${product.id}`));
    if (res.ok) {
      const logs: ProductUpdateLog[] = await res.json();
      setUpdateLogs(logs);
      return;
    }
    toast.error('업데이트 내역을 불러오는데 실패했습니다');
  };

  const sendUpdateLog = async () => {
    const res = await authFetch(
      session,
      endpoint(`/v1/products_log/create/${product.id}`),
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: sendTitle,
          content: sendContent,
        }),
      },
    );
    if (res.ok) {
      toast.success('업데이트 내역이 성공적으로 작성되었습니다');
      getUpdateLog();
    } else {
      toast.error('업데이트 내역 작성에 실패했습니다');
    }
  };

  const updateUpdateLog = async (id: number) => {
    const res = await authFetch(
      session,
      endpoint(`/v1/products_log/update/${id}`),
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          title: updatedTitle,
          content: updatedContent,
        }),
      },
    );
    if (res.ok) {
      toast.success('업데이트 내역이 성공적으로 수정되었습니다');
      getUpdateLog();
    } else {
      toast.error('업데이트 내역 수정에 실패했습니다');
    }
  };

  const delUpdateLog = async (id: number) => {
    const res = await authFetch(
      session,
      endpoint(`/v1/products_log/delete/${id}`),
      {
        method: 'POST',
      },
    );
    if (res.ok) {
      toast.success('업데이트 내역이 성공적으로 삭제되었습니다');
      getUpdateLog();
    } else {
      toast.error('업데이트 내역 삭제에 실패했습니다');
    }
  };

  const getVersionList = async () => {
    // if (!purchased) return;
    const res = await fetch(
      endpoint(`/v1/products_versions/list/${product.id}`),
    );
    if (res.ok) {
      const versions: ProductVersion[] = await res.json();
      setVersions(versions);
    }
  };

  const createVersion = async () => {
    if (!isAuthor) return;
    const res = await authFetch(
      session,
      endpoint(`/v1/products_versions/create/${product.id}`),
      {
        method: 'POST',
        body: JSON.stringify({
          version_name: createVersionValues.version_name,
          link: createVersionValues.link,
          index: 0,
        }),
      },
    );

    if (res.ok) {
      toast.success('버전이 성공적으로 추가되었습니다');
      setCreateVersionValues({
        id: 0,
        product_id: 0,
        version_name: '',
        link: '',
        index: 0,
        updated_at: '',
      });
      getVersionList();
    } else {
      toast.error('버전 추가에 실패했습니다');
    }
  };

  const deleteVersion = async (id: number) => {
    if (!isAuthor) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await authFetch(
      session,
      endpoint(`/v1/products_versions/delete/${id}`),
      {
        method: 'POST',
      },
    );

    if (res.ok) {
      toast.success('버전이 성공적으로 삭제되었습니다');
      getVersionList();
    } else {
      toast.error('버전 삭제에 실패했습니다');
    }
  };

  const updateVersion = async (id: number) => {
    if (!isAuthor) return;
    if (!updateVersionValues.version_name || !updateVersionValues.link) {
      toast.error('버전 이름과 링크를 입력해주세요');
      return;
    }
    if (!confirm('정말 수정하시겠습니까?')) return;
    const res = await authFetch(
      session,
      endpoint(`/v1/products_versions/update/${id}`),
      {
        method: 'POST',
        body: JSON.stringify({
          version_name: updateVersionValues.version_name,
          link: updateVersionValues.link,
          index: 0,
        }),
      },
    );

    if (res.ok) {
      toast.success('버전이 성공적으로 수정되었습니다');
      setVersionUpdatingIndex(-1);
      getVersionList();
    } else {
      toast.error('버전 수정에 실패했습니다');
    }
  };

  useEffect(() => {
    if (session?.user.id === product.creator.id) setIsAuthor(true);
    getUpdateLog();
    getVersionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const log = updateLogs.find((log) => log.id === updatingIndex);
    setUpdatedContent(log?.content ?? '');
    setUpdatedTitle(log?.title ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingIndex]);

  return (
    <>
      <ProductPurchaseDialog
        isOpen={isPurchaseOpen}
        onOpenChange={setPurchaseOpen}
        product={product}
      />
      <div className="flex justify-center">
        <div className="container flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {onBack != 'disabled' && (
              <OptionalLink
                href={onBack == 'go_to_category' ? category.link : undefined}
              >
                <Button
                  className="size-12 rounded-full p-0"
                  variant="ghost"
                  onClick={() => {
                    if (typeof onBack === 'function') {
                      onBack();
                    }
                  }}
                >
                  <ChevronLeftIcon size={32} />
                </Button>
              </OptionalLink>
            )}
            <p className="text-3xl font-semibold">{category.name}</p>
          </div>
          <div className="grid grid-cols-1 grid-rows-[min-content_auto] gap-6 gap-x-8 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border-2">
              <FallbackImage
                src={product && endpoint(`/v1/products/${product.id}/image`)}
                fill={true}
                className="object-contain"
                alt="Product Image"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-4xl font-semibold">{product?.name}</div>
              <div className="mt-2 text-2xl">{product?.description}</div>
              <div className="mt-auto flex items-center gap-2 text-2xl">
                <UserAvatar userId={product.creator.id} />
                <div className="h-full">
                  <p className="text-xl font-bold">
                    {product.creator?.nickname ??
                      `@${product.creator?.username}`}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, i) => (
                    <TagCard key={i} tag={tag}>
                      #{tag}
                    </TagCard>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <SmallCard
                    tooltip={new Date(product?.created_at).toLocaleString()}
                  >
                    <PlusIcon />
                    {dayjs(product?.created_at).format('YYYY/MM/DD')}
                  </SmallCard>
                  {new Date(product?.created_at).getTime() !=
                    new Date(product?.updated_at).getTime() && (
                    <SmallCard
                      tooltip={new Date(product?.updated_at).toLocaleString()}
                    >
                      <HammerIcon />
                      {dayjs(product?.updated_at).format('YYYY/MM/DD')}
                    </SmallCard>
                  )}
                  <SmallCard>
                    {product.price_discount ? (
                      <>
                        <CircleDollarSign />
                        <s className="italic text-destructive">
                          {product.price}
                        </s>
                        <ChevronRightIcon size={20} />
                        <p className="font-bold">{product.price_discount}</p>
                      </>
                    ) : (
                      <>
                        <CircleDollarSign />
                        {product.price}원
                      </>
                    )}
                  </SmallCard>
                </div>
                <div className="mt-4 flex flex-col gap-2 *:flex-1 *:gap-2 *:py-4 *:text-xl md:flex-row md:*:p-6">
                  {purchased ? (
                    <Button onClick={() => setIndex(2)}>
                      <DownloadIcon />
                      다운로드
                    </Button>
                  ) : (
                    <Button size="lg" onClick={() => setPurchaseOpen(true)}>
                      <CreditCardIcon />
                      구매하기
                    </Button>
                  )}
                  {!purchased && (
                    <Button
                      size="lg"
                      variant={isInCart ? 'secondary' : 'outline'}
                      className="border"
                      onClick={() => {
                        if (isInCart) removeFromCart(product.id);
                        else addToCart(product.id);
                      }}
                    >
                      {isInCart ? (
                        <>
                          <ShoppingCartIcon />
                          카트에 추가됨
                          <CheckIcon />
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon />
                          카트에 추가
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {/* 개요, 업데이트 내역, 버전 목록 */}
            <div className="flex w-full gap-1 border-b border-gray-300">
              <div
                className={
                  'cursor-pointer rounded-t-md border-2 border-b-0 px-4 py-2 ' +
                  (index === 0 && 'bg-black text-white')
                }
                onClick={() => setIndex(0)}
              >
                개요
              </div>
              <div
                className={
                  'cursor-pointer rounded-t-md border-2 border-b-0 px-4 py-2 ' +
                  (index === 1 && 'bg-black text-white')
                }
                onClick={() => setIndex(1)}
              >
                업데이트 내역
              </div>
              <div
                className={
                  'cursor-pointer rounded-t-md border-2 border-b-0 px-4 py-2 ' +
                  (index === 2 && 'bg-black text-white')
                }
                onClick={() => setIndex(2)}
              >
                버전 목록
              </div>
            </div>
            <div className="prose prose-lg min-h-64 max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-headings:text-white dark:prose-p:text-gray-300 md:col-span-2">
              {index === 0 && (
                <div dangerouslySetInnerHTML={{ __html: product.details }} />
              )}
              {index === 1 && (
                <div className="flex flex-col gap-4">
                  {isAuthor && (
                    <div className="flex flex-col gap-4">
                      <div className="text-xl font-semibold">업데이트 작성</div>
                      <input
                        type="text"
                        placeholder="업데이트 제목"
                        className="rounded-md border-2 p-2"
                        value={sendTitle}
                        onChange={(e) => setSendTitle(e.target.value)}
                      />
                      <textarea
                        placeholder="업데이트 내용"
                        className="h-32 rounded-md border-2 p-2"
                        value={sendContent}
                        onChange={(e) => setSendContent(e.target.value)}
                      />
                      <Button onClick={sendUpdateLog}>작성</Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-semibold">업데이트 내역</div>
                    {updateLogs.map((log) => (
                      <div key={log.id} className="mt-4">
                        <div className="flex justify-between">
                          {updatingIndex !== log.id && (
                            <div className="text-xl font-semibold">
                              {log.title} -{' '}
                              {dayjs(log.update_at).format('YYYY/MM/DD')}
                            </div>
                          )}
                          {updatingIndex === log.id && (
                            <>
                              <Input
                                value={updatedTitle}
                                onChange={(e) =>
                                  setUpdatedTitle(e.target.value)
                                }
                              />
                              <Textarea
                                value={updatedContent}
                                onChange={(e) =>
                                  setUpdatedContent(e.target.value)
                                }
                              />
                            </>
                          )}

                          {isAuthor && (
                            <div className="flex gap-2">
                              {updatingIndex !== log.id && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => setUpdatingIndex(log.id)}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => delUpdateLog(log.id)}
                                  >
                                    삭제
                                  </Button>
                                </>
                              )}
                              {updatingIndex === log.id && (
                                <>
                                  <Button
                                    onClick={() => {
                                      updateUpdateLog(log.id);
                                      setUpdatingIndex(-1);
                                    }}
                                  >
                                    완료
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => setUpdatingIndex(-1)}
                                  >
                                    취소
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {updatingIndex !== log.id && (
                          <div className="ml-6 text-lg">{log.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {index === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="text-xl font-semibold">버전 목록</div>
                  {isAuthor && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="버전 이름"
                        value={createVersionValues?.version_name}
                        onChange={(e) =>
                          setCreateVersionValues({
                            ...createVersionValues,
                            version_name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="링크"
                        value={createVersionValues?.link}
                        onChange={(e) =>
                          setCreateVersionValues({
                            ...createVersionValues,
                            link: e.target.value,
                          })
                        }
                      />
                      <Button onClick={createVersion}>추가</Button>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>업데이트 일자</TableHead>
                        <TableHead>버전</TableHead>
                        <TableHead>링크</TableHead>
                        {isAuthor && (
                          <>
                            <TableHead>수정/삭제</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {versions?.map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            {new Date(version.updated_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {versionUpdatingIndex !== version.id &&
                              (purchased || isAuthor
                                ? version.version_name
                                : '구매 후 확인 가능')}
                            {versionUpdatingIndex === version.id && (
                              <Input
                                value={updateVersionValues.version_name}
                                onChange={(e) =>
                                  setUpdateVersionValues({
                                    ...updateVersionValues,
                                    version_name: e.target.value,
                                  })
                                }
                                placeholder="버전 이름"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {versionUpdatingIndex !== version.id &&
                              (purchased || isAuthor) && (
                                <Link href={version.link}>Download</Link>
                              )}
                            {versionUpdatingIndex === version.id && (
                              <>
                                <Input
                                  value={updateVersionValues.link}
                                  onChange={(e) =>
                                    setUpdateVersionValues({
                                      ...updateVersionValues,
                                      link: e.target.value,
                                    })
                                  }
                                  placeholder="링크"
                                />
                              </>
                            )}
                          </TableCell>
                          {isAuthor && (
                            <>
                              <TableCell className="flex gap-2">
                                {versionUpdatingIndex !== version.id && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setUpdateVersionValues(version);
                                      setVersionUpdatingIndex(version.id);
                                    }}
                                  >
                                    수정
                                  </Button>
                                )}
                                {versionUpdatingIndex === version.id && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateVersion(version.id)}
                                  >
                                    완료
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteVersion(version.id)}
                                >
                                  삭제
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
