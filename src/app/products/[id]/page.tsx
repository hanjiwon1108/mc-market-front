import { ProductDetail } from '@/components/product/product-detail';
import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await fetch(endpoint(`/v1/products/${id}`)).then(
    (res) => res.json() as Promise<MarketProductWithShortUser | undefined>,
  );

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div>
          <p className="text-5xl font-semibold">오류</p>
          <p className="text-xl">이 페이지에 접근할 수 없습니다 ):</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:py-20">
      <ProductDetail product={product} />
    </div>
  );
}
