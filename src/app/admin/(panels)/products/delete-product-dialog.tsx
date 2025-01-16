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

export function DeleteProductDialog({
  product,
  isOpen,
  onOpenChange,
}: {
  product: MarketProductId;
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const session = useSession();
  const swrConfig = useSWRConfig();
  const mutation = useSWRMutation(
    endpoint(`/v1/products/${product.id}`),
    (url) => {
      if (!session) return;
      return authFetch(session, url, {
        method: 'DELETE',
      }).then((r) => {
        if (r.ok) {
          toast.info('상품을 삭제했습니다');
          void swrConfig.mutate(endpoint(`/v1/products`));
          onOpenChange(false);
        } else {
          toast.error('상품을 삭제하지 못했습니다!');
        }
      });
    },
  );

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
          disabled={mutation.isMutating}
          onClick={() => mutation.trigger()}
        >
          삭제합니다
        </Button>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
