import { MarketProductWithShortUser } from '@/api/types';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimateFade } from '@/components/animate/animate-fade';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimateScaleFade } from '@/components/animate/animate-scale-fade';
import { cn } from '@/lib/utils';
import useSWRMutation from 'swr/mutation';
import { endpoint } from '@/api/market/endpoint';
import { authFetch } from '@/api/surge/fetch';
import { toast } from 'sonner';
import { useSession } from '@/api/surge';

export function ProductFileDialog({
  isOpen,
  onOpenChange,
  product,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  product: MarketProductWithShortUser;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const session = useSession();

  const mutation = useSWRMutation(
    endpoint(`/v1/products/${product.id}/file`),
    (url) => {
      if (!session || !file) return;

      const data = new FormData();
      data.append('file', file);

      return authFetch(session, url, {
        method: 'POST',
        body: data,
      }).then((r) => {
        if (r.ok) {
          toast.info('컨텐츠 변경을 완료했습니다');
          onOpenChange(false);
        } else {
          toast.error('컨텐츠를 변경하지 못했습니다!');
        }
      });
    },
  );

  return (
    <ResponsiveDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>상품 컨텐츠 수정</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            컨텐츠를 업로드합니다.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            id="product/input:image_upload"
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setFile(e.target.files ? e.target.files[0] : null);
            }}
          />
          <label
            htmlFor="product/input:image_upload"
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setDragging(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setDragging(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setFile(e.dataTransfer.files[0]);
              setDragging(false);
            }}
          >
            <div className="group relative flex w-full select-none items-center justify-center rounded-2xl border-2 p-2 py-16 transition-all duration-300 ease-primary hover:bg-accent">
              <AnimatePresence>
                {isDragging && (
                  <AnimateScaleFade className="pointer-events-none absolute size-full backdrop-blur">
                    <Skeleton className="flex size-full items-center justify-center text-xl font-bold text-white">
                      <div>드롭해서 파일 업로드</div>
                    </Skeleton>
                  </AnimateScaleFade>
                )}
              </AnimatePresence>
              <div
                className={cn(
                  'pointer-events-none flex flex-col items-center justify-center transition-all duration-300 ease-primary group-hover:scale-90 group-hover:opacity-75',
                )}
              >
                <AnimateFade key={file?.name}>
                  <div
                    className={cn(
                      'flex max-w-80 items-center gap-2 text-2xl font-semibold',
                    )}
                  >
                    {file ? (
                      <>
                        <PaperclipIcon />
                        <p className="truncate">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <UploadIcon />
                        파일 업로드
                      </>
                    )}
                  </div>
                </AnimateFade>
                <div className="text-lg text-gray-600">
                  이 영역에 드래그 또는 클릭
                </div>
              </div>
            </div>
          </label>

          <Button
            className="mt-2 w-full"
            variant="outline"
            disabled={!file || mutation.isMutating}
            onClick={() => mutation.trigger()}
          >
            업로드
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
