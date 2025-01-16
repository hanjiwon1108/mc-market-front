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
import {
  ProductEditDialog,
  ProductEditDialogState,
} from '@/components/product/product-edit-dialog';
import { CategoryKey } from '@/features/category';

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

  const [state, setState] = useState<ProductEditDialogState>({
    name: product.name,
    category: product.category as CategoryKey,
    description: product.description,
    usage: product.usage,
    details: product.details,
    price: product.price,
    price_discount: product.price_discount,
    tags: product.tags ?? [],
  });

  const [isMutating, setMutating] = useState(false);

  async function trigger() {
    if (!session) return;

    setMutating(true);
    const toastId = toast.loading('편집 중...');

    const response = await authFetch(
      session,
      endpoint(`/v1/products/${product.id}`),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(state),
      },
    );
    setMutating(false);

    if (response.ok) {
      onOpenChange(false);
      toast.info('편집됨', { id: toastId });
    } else {
      toast.error('편집 실패', { id: toastId });
    }
  }

  return (
    <>
      <ProductEditDialog
        isLoading={isMutating}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        state={state}
        onStateChange={setState}
        onComplete={trigger}
      />
    </>
  );
}
