import { ProductDetail } from '@/components/product/product-detail';

export default async function Page({}: { params: { id: string } }) {
  return (
    <div className="py-20">
      <ProductDetail />
    </div>
  );
}
