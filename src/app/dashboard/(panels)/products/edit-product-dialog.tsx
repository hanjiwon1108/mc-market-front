import { Button } from '@/components/ui/button';
import {
  EditProductForm,
  useEditProductFormState,
} from '@/app/dashboard/(panels)/products/edit-product-form';
import React, { useState } from 'react';
import { useSession } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { endpoint } from '@/api/market/endpoint';
import { toast } from 'sonner';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { MarketProductWithShortUser } from '@/api/types';

export function EditProductDialog({
  isOpen,
  onOpenChange,
  product,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  product: MarketProductWithShortUser;
}) {
  const session = useSession();

  const formState = useEditProductFormState({
    name: product.name,
    creator: product.creator.id.toString(),
    description: product.description,
    usage: product.usage,
    discount: product.price_discount,
    price: product.price,
    category: product.category,
  });

  const [isMutating, setMutating] = useState(false);

  function trigger() {
    if (!session) return;
    setMutating(true);
    authFetch(session, endpoint(`/v1/products/${product.id}`), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        ...formState,
      }),
    }).then((it) => {
      setMutating(false);
      if (it.ok) {
        toast.info('수정 업로드 완료');
      } else {
        toast.error('수정 업로드 실패!');
      }
    });
  }

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>상품 수정</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <EditProductForm state={formState} />

        <Button onClick={trigger} disabled={isMutating} className="mt-4">
          수정
        </Button>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
