import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import useSWRMutation from 'swr/mutation';
import { MarketProductId } from '@/api/types';
import { endpoint } from '@/api/market/endpoint';
import { useSession } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useCart } from '@/core/cart/atom';

export function DeleteProductFromCartDialog({
  product,
  isOpen,
  onOpenChange,
}: {
  product: MarketProductId;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { removeElement } = useCart();

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>상품 삭제</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            정말로 이 상품을 삭제합니까?
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Button
          variant="destructive"
          className="md:ml-auto"
          onClick={() => {
            setTimeout(() => removeElement(product.id), 500);
            onOpenChange(false);
          }}
        >
          삭제합니다
        </Button>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
