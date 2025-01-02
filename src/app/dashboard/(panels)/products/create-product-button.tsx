import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { endpoint } from '@/api/market/endpoint';
import { useSession, useUser } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { toast } from 'sonner';
import {
  ProductEditDialog,
  ProductEditDialogState,
} from '@/components/product/product-edit-dialog';

export function CreateProductButton() {
  const session = useSession();

  const [isOpen, setOpen] = useState(false);
  const [state, setState] = useState<ProductEditDialogState>({
    name: '',
    category: 'misc',
    description: '',
    usage: '',
    details: '',
    price: 0,
    price_discount: undefined,
    tags: [],
  });

  const [isMutating, setMutating] = useState(false);

  async function trigger() {
    if (!session) return;

    setMutating(true);
    const toastId = toast.loading('제품 등록 중...');

    const response = await authFetch(session, endpoint(`/v1/products`), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(state),
    });
    setMutating(false);

    if (response.ok) {
      setOpen(false);
      toast.info('제품 등록됨', { id: toastId });
    } else {
      toast.error('제품 등록 실패', { id: toastId });
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        새 제품 등록
      </Button>
      <ProductEditDialog
        isLoading={isMutating}
        isCreate
        isOpen={isOpen}
        onOpenChange={setOpen}
        state={state}
        onStateChange={setState}
        onComplete={trigger}
      />
    </>
  );
}
