import { CustomDialogProps } from '@/util/types-props';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, LoaderCircleIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORIES,
  CategoryKey,
  resolveCategoryName,
} from '@/features/category';
import { Textarea } from '@/components/ui/textarea';
import { BasicEditor } from '@/components/editor/basic-editor';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const stages = [
  ['기본 정보', BasicInfoStage],
  ['설명', DescriptionsStage],
  ['디테일', DetailsStage],
  ['가격 및 할인', PricingStage],
  ['최종 검토', CompleteStage],
] as const;

export type ProductEditDialogState = {
  name: string;
  category: CategoryKey;
  description: string;
  usage: string;
  details: string;
  tags: string[];
  price: number;
  price_discount?: number;
};

export type ProductEditDialogProps = CustomDialogProps & {
  isLoading?: boolean;
  isCreate?: boolean;
  state: ProductEditDialogState;
  onStateChange: React.Dispatch<React.SetStateAction<ProductEditDialogState>>;
  onComplete: () => void;
};

export function ProductEditDialog(props: ProductEditDialogProps) {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState(
    props.isCreate ? stage : stages.length,
  );

  useEffect(() => {
    if (stage > progress) setProgress(stage);
  }, [progress, stage]);

  const Component = stages[stage][1];

  return (
    <ResponsiveDialog isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ResponsiveDialogContent>
        <div
          className={cn(
            'absolute z-10 flex size-full items-center justify-center rounded-lg bg-muted/50 outline-none backdrop-blur transition-all duration-500 ease-primary',
            props.isLoading ? '' : 'pointer-events-none select-none opacity-0',
          )}
        >
          <LoaderCircleIcon className="animate-ping" />
        </div>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {props.isCreate ? '상품 추가' : '상품 편집'}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                단계 {stage + 1}/{stages.length} - {stages[stage][0]}
                <ChevronDownIcon size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {stages.map(([item], index) => (
                  <DropdownMenuItem
                    key={index}
                    disabled={progress < index}
                    onSelect={() => setStage(index)}
                  >
                    {index + 1}. {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <Component
          onStageChange={setStage}
          state={props.state}
          onStateChange={props.onStateChange}
          onComplete={props.onComplete}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

type StageProps = {
  state: ProductEditDialogState;
  onStageChange: React.Dispatch<React.SetStateAction<number>>;
  onStateChange: React.Dispatch<React.SetStateAction<ProductEditDialogState>>;
  onComplete: () => void;
};

function BasicInfoStage(props: StageProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(() => {
    if (!nameInputRef.current?.checkValidity()) {
      nameInputRef.current?.focus();
      return false;
    }

    return true;
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="product/name" isRequired>
        이름
      </Label>
      <Input
        id="product/name"
        ref={nameInputRef}
        required
        minLength={1}
        maxLength={50}
        value={props.state.name}
        onValueChange={(v) => props.onStateChange((p) => ({ ...p, name: v }))}
      />

      <Label htmlFor="product/category" isRequired>
        카테고리
      </Label>
      <Select
        value={props.state.category}
        onValueChange={(v) =>
          props.onStateChange({ ...props.state, category: v as CategoryKey })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(CATEGORIES)
            .filter(([, category]) => !category.hidden)
            .map(([key, category]) => (
              <SelectGroup key={key}>
                <SelectLabel>{category.name}</SelectLabel>
                <SelectItem value={key}>{category.name}</SelectItem>
                {Object.entries(category.subcategories).map(
                  ([key, [, value]]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 *:flex-1">
        <Button onClick={() => validate() && props.onStageChange((p) => p + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}

function DescriptionsStage(props: StageProps) {
  const usageInputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const validate = useCallback(() => {
    if (!usageInputRef.current?.checkValidity()) {
      usageInputRef.current?.focus();
      return false;
    }

    if (!descriptionInputRef.current?.checkValidity()) {
      descriptionInputRef.current?.focus();
      return false;
    }

    return true;
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="product/usage" isRequired>
        용도 (300자 이내)
      </Label>
      <Textarea
        id="product/usage"
        placeholder="상품의 용도 또는 이 상품이 사용되는 방법"
        required
        minLength={1}
        maxLength={300}
        ref={usageInputRef}
        value={props.state.usage}
        onValueChange={(v) => props.onStateChange((p) => ({ ...p, usage: v }))}
      />

      <Label htmlFor="product/description" isRequired>
        설명 (300자 이내)
      </Label>
      <Textarea
        id="product/description"
        placeholder="간략한 설명"
        required
        minLength={1}
        maxLength={300}
        ref={descriptionInputRef}
        value={props.state.description}
        onValueChange={(v) =>
          props.onStateChange((p) => ({ ...p, description: v }))
        }
      />

      <Label htmlFor="product/description">태그 (쉼표로 구분)</Label>
      <Input
        id="product/tags"
        placeholder="태그"
        value={props.state.tags.join(',')}
        onValueChange={(v) =>
          props.onStateChange((p) => ({ ...p, tags: v.split(',') }))
        }
      />

      <div className="flex gap-2 *:flex-1">
        <Button
          onClick={() => props.onStageChange((p) => p - 1)}
          variant="outline"
        >
          이전
        </Button>
        <Button onClick={() => validate() && props.onStageChange((p) => p + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}

function DetailsStage(props: StageProps) {
  const validate = useCallback(() => {
    const plainContent = new DOMParser().parseFromString(
      props.state.details,
      'text/html',
    ).body.textContent;
    return plainContent && plainContent.length >= 1;
  }, [props.state.details]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="product/usage" isRequired>
        디테일
      </Label>
      <BasicEditor
        content={props.state.details}
        onContentChange={(v) => {
          const value = typeof v == 'function' ? v(props.state.details) : v;
          props.onStateChange((p) => ({ ...p, details: value }));
        }}
      />

      <div className="flex gap-2 *:flex-1">
        <Button
          onClick={() => props.onStageChange((p) => p - 1)}
          variant="outline"
        >
          이전
        </Button>
        <Button onClick={() => validate() && props.onStageChange((p) => p + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}

function PricingStage(props: StageProps) {
  const priceInputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(() => {
    if (!priceInputRef.current?.checkValidity()) {
      priceInputRef.current?.focus();
      return false;
    }

    return true;
  }, []);

  function tryParseInt(v: string) {
    try {
      const parsed = parseInt(v);
      return isNaN(parsed) ? null : parsed;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      return null;
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="product/price" isRequired>
        가격 (₩)
      </Label>
      <Input
        id="product/price"
        placeholder="가격 (₩)"
        type="number"
        min={0}
        ref={priceInputRef}
        value={props.state.price}
        onValueChange={(v) =>
          props.onStateChange((p) => ({ ...p, price: tryParseInt(v) ?? 0 }))
        }
      />

      <Label htmlFor="product/price_discount">
        가격 할인 (₩)
        <p className="ml-1 text-xs text-foreground/50">
          지정되면 이 가격으로 판매됩니다
        </p>
      </Label>
      <Input
        id="product/price_discount"
        placeholder="할인 (₩)"
        value={props.state.price_discount ?? ''}
        onValueChange={(v) =>
          props.onStateChange((p) => ({
            ...p,
            price_discount: tryParseInt(v) ?? undefined,
          }))
        }
      />

      <div className="flex gap-2 *:flex-1">
        <Button
          onClick={() => props.onStageChange((p) => p - 1)}
          variant="outline"
        >
          이전
        </Button>
        <Button onClick={() => validate() && props.onStageChange((p) => p + 1)}>
          다음
        </Button>
      </div>
    </div>
  );
}

function CompleteStage(props: StageProps) {
  const rows: [string, React.ReactNode][] = [
    ['이름', props.state.name],
    ['카테고리', resolveCategoryName(props.state.category)],
    ['설명', props.state.description],
    ['용도', props.state.usage],
    [
      '태그',
      props.state.tags.length > 0
        ? props.state.tags.map((it) => `#${it}`).join(' ')
        : '없음',
    ],
    [
      '디테일',
      new DOMParser().parseFromString(props.state.details, 'text/html').body
        .textContent || '',
    ],
    ['가격', props.state.price + '원'],
    [
      '할인',
      props.state.price_discount ? props.state.price_discount + '원' : '없음',
    ],
  ];

  return (
    <div>
      <Table>
        <TableCaption>최종 상품 정보입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>값</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([k, v]) => (
            <TableRow key={k}>
              <TableCell>{k}</TableCell>
              <TableCell className="max-w-96 text-ellipsis">{v}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-2 flex gap-2 *:flex-1">
        <Button
          onClick={() => props.onStageChange((p) => p - 1)}
          variant="outline"
        >
          이전
        </Button>
        <Button onClick={props.onComplete}>완료</Button>
      </div>
    </div>
  );
}
