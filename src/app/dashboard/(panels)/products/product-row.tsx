import { MarketProductWithShortUser } from '@/api/types';
import { TableCell, TableRow } from '@/components/ui/table';
import Image from 'next/image';
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
import React from 'react';
import { DeleteProductDialog } from '@/app/dashboard/(panels)/products/delete-product-dialog';
import { EditProductDialog } from '@/app/dashboard/(panels)/products/edit-product-dialog';
import { ProductImageDialog } from '@/app/dashboard/(panels)/products/product-image-dialog';
import { endpoint } from '@/api/market/endpoint';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { authFetch } from '@/api/surge/fetch';
import { useSession } from '@/api/surge';
import { toast } from 'sonner';
import { ProductFileDialog } from '@/app/dashboard/(panels)/products/product-file-dialog';

export function ProductRow({
  product,
}: {
  product: MarketProductWithShortUser;
}) {
  const session = useSession();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [fileDialogOpen, setFileDialogOpen] = React.useState(false);

  const revenues = useSWR(
    endpoint(`/v1/products/${product.id}/revenues`),
    async (u) => {
      if (!session) return;
      const response = await authFetch(session, u);
      const json = await response.json();
      if (!response.ok) {
        toast.error(JSON.stringify(json));
        throw await json;
      }

      return json as number;
    },
  );

  return (
    <>
      <DeleteProductDialog
        product={product}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <EditProductDialog
        product={product}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <ProductImageDialog
        product={product}
        isOpen={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
      />
      <ProductFileDialog
        product={product}
        isOpen={fileDialogOpen}
        onOpenChange={setFileDialogOpen}
      />
      <div className="flex flex-row items-center justify-between gap-4 rounded-xl border p-4 shadow-sm">
        {/* 이미지 */}
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent">
          <Image
            src={endpoint(`/v1/products/${product.id}/image`)}
            alt="상품 이미지"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="truncate font-semibold">{product.name}</div>
          <div className="truncate text-sm text-muted-foreground">
            {product.description}
          </div>
          <div className="text-sm">
            {product.price}원{' '}
            {product.price_discount && (
              <span className="text-muted-foreground">
                ({product.price_discount}원)
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            생성: {product.created_at.toLocaleString()} / 수정:{' '}
            {product.updated_at.toLocaleString()}
          </div>
        </div>

        {/* 수익 정보 */}
        <div className="min-w-28 text-right text-sm text-muted-foreground">
          미정산 수익
          <div className="font-medium text-black">
            {revenues.data ?? '불러오는 중'}
          </div>
        </div>

        {/* 메뉴 버튼 */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>작업</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/products/${product.id}`)}
            >
              상품 상세 보기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              내용 수정
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
              이미지 업로드/수정
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFileDialogOpen(true)}>
              컨텐츠 업로드
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              상품 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
