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
  UploadIcon,
  UserIcon,
} from 'lucide-react';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
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

export function ProductDetail({
  onBack,
  product,
  purchased,
}: ProductDetailProps) {
  const category =
    (product && CATEGORIES[product.category.split('.')[0] as TopCategoryKey]) ??
    CATEGORY_ALL;

  const isInCart = useIsInCart(product.id);
  const { addElement: addToCart, removeElement: removeFromCart } = useCart();

  const download = useDownload(product.id);

  const [isPurchaseOpen, setPurchaseOpen] = React.useState(false);

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
                <div>
                  <p className="text-lg">크리에이터</p>
                  <p className="text-sm font-bold">
                    {product.creator.nickname ?? `@${product.creator.username}`}
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
                      <UploadIcon />
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
                    download.isDownloading ? (
                      <Button disabled>
                        <CircleDashed />
                        다운로드 중 {download.progress * 100}%
                      </Button>
                    ) : download.isCacheAvailable ? (
                      <Button onClick={download.download}>
                        <CheckIcon />
                        다운로드 완료
                      </Button>
                    ) : (
                      <Button onClick={download.download}>
                        <DownloadIcon />
                        다운로드
                      </Button>
                    )
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
            <div className="prose prose-lg col-span-2 min-h-64 max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-headings:text-white dark:prose-p:text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: product.details }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
