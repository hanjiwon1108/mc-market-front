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
import { DeleteProductDialog } from '@/app/admin/(panels)/products/delete-product-dialog';
import { EditProductDialog } from '@/app/admin/(panels)/products/edit-product-dialog';
import { ProductImageDialog } from '@/app/admin/(panels)/products/product-image-dialog';
import { endpoint } from '@/api/market/endpoint';

export function ProductRow({
  product,
}: {
  product: MarketProductWithShortUser;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);

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
      <TableRow>
        <TableCell className="mx-auto my-2 mr-4 flex h-16 w-full min-w-24 max-w-40 items-center justify-center rounded-2xl bg-accent">
          <Image
            src={endpoint(`/v1/products/${product.id}/image`)}
            height={32}
            width={32}
            alt="Product Image"
          />
        </TableCell>
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.creator.nickname ?? product.creator.id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.description}</TableCell>
        <TableCell>{product.created_at.toLocaleString()}</TableCell>
        <TableCell>{product.updated_at.toLocaleString()}</TableCell>
        <TableCell>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              {/*<DropdownMenuItem disabled>상품 비공개</DropdownMenuItem>*/}
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                내용 수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
                이미지 업로드/수정
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
        </TableCell>
      </TableRow>
    </>
  );
}
