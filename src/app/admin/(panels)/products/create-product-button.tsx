import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { endpoint } from '@/api/market/endpoint';
import { useSession, useUser } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { toast } from 'sonner';
import {
  EditProductForm,
  useEditProductFormState,
} from '@/app/admin/(panels)/products/edit-product-form';

export function CreateProductButton() {
  const session = useSession();
  const user = useUser();

  const formState = useEditProductFormState();

  const [isMutating, setMutating] = useState(false);

  function trigger() {
    if (!session) return;
    setMutating(true);
    authFetch(session, endpoint(`/v1/products`), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        ...formState,
        creator: Number(BigInt(formState.creator)),
      }),
    }).then((it) => {
      setMutating(false);
      if (it.ok) {
        toast.info('상품 등록됨');
      } else {
        toast.error('상품 등록 실패');
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">새 상품 등록</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 상품 등록</DialogTitle>
        </DialogHeader>

        <EditProductForm state={formState} />

        <Button onClick={trigger} disabled={isMutating}>
          생성
        </Button>
      </DialogContent>
    </Dialog>
  );
}
