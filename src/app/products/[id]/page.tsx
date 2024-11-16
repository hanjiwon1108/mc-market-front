import { ProductDetail } from '@/components/product/product-detail';

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="py-20">
      <ProductDetail />
    </div>
  );
}
