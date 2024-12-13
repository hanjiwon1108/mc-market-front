import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useUser } from '@/api/surge';
import { AutoComplete } from '@/components/ui/autocomplete';
import { CATEGORIES } from '@/features/category';

type EditProductFormState = Partial<{
  name: string;
  creator: string;
  description: string;
  usage: string;
  category: string;
  price: number;
  discount?: number;
}>;

export function useEditProductFormState(initial: EditProductFormState = {}) {
  const [name, setName] = useState(initial.name ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [category, setCategory] = useState(initial.category ?? '');
  const [usage, setUsage] = useState(initial.usage ?? '');
  const [price, setPrice] = useState(initial.price ?? 0);
  const [discount, setDiscount] = useState(initial.discount ?? 0);

  return {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    usage,
    setUsage,
    price,
    setPrice,
    discount,
    setDiscount,
  };
}

export function EditProductForm({
  state,
}: {
  state: ReturnType<typeof useEditProductFormState>;
}) {
  return (
    <>
      <div>
        <Label htmlFor="create_product/id">상품 이름</Label>
        <Input
          id="create_product/id"
          value={state.name}
          onValueChange={state.setName}
        />
      </div>
      <div>
        <Label htmlFor="create_product/description">상품 설명</Label>
        <Input
          id="create_product/description"
          value={state.description}
          onValueChange={state.setDescription}
        />
      </div>
      <div>
        <Label htmlFor="create_product/usage">상품 사용법</Label>
        <Input
          id="create_product/usage"
          value={state.usage}
          onValueChange={state.setUsage}
        />
      </div>
      <div>
        <Label htmlFor="create_product/category">
          상품 카테고리 (카테고리 식별자)
        </Label>
        {/*<Input*/}
        {/*  id="create_product/category"*/}
        {/*  value={state.category}*/}
        {/*  onValueChange={state.setCategory}*/}
        {/*/>*/}
        <AutoComplete
          selectedValue=""
          onSelectedValueChange={() => {}}
          value={state.category}
          onValueChange={state.setCategory}
          items={Object.values(CATEGORIES).flatMap((it) => ({
            value: it.path,
            label: `${it.path} (${it.name})`,
          }))}
        />
      </div>
      <div>
        <Label htmlFor="create_product/price">상품 가격 (단위: ₩)</Label>
        <Input
          id="create_product/price"
          value={state.price}
          type="number"
          min={0}
          onValueChange={(v) => state.setPrice(Number.parseInt(v))}
        />
      </div>
      <div>
        <Label htmlFor="create_product/price">상품 할인 (단위: ₩)</Label>
        <Input
          id="create_product/discount"
          value={state.discount}
          type="number"
          min={0}
          onValueChange={(v) => state.setDiscount(Number.parseInt(v))}
        />
      </div>
    </>
  );
}
