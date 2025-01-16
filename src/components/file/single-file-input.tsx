import React, { ComponentProps, useId, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimateScaleFade } from '@/components/animate/animate-scale-fade';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnimateFade } from '@/components/animate/animate-fade';
import { PaperclipIcon, UploadIcon } from 'lucide-react';

export type SingleFileInputProps = ComponentProps<'input'>;

export const SingleFileInput = React.forwardRef<
  HTMLInputElement,
  SingleFileInputProps
>((props, ref) => {
  const inputId = useId();
  const [isDragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <input
        {...props}
        id={inputId}
        ref={ref}
        type="file"
        className="hidden"
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setFile(e.target.files ? e.target.files[0] : null);
        }}
      />
      <label
        htmlFor={inputId}
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
        <div
          className={cn(
            'group relative flex w-full select-none items-center justify-center rounded-2xl border-2 p-2 py-16 transition-all duration-300 ease-primary hover:bg-accent',
            props.className,
          )}
        >
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
    </div>
  );
});

SingleFileInput.displayName = 'SingleFileInput';
