import { endpoint } from '@/api/market/endpoint';
import { MarketProductWithShortUser } from '@/api/types';
import { getSession } from '@/api/surge';
import { authFetch } from '@/api/surge/fetch';
import { PageUpdater } from '@/app/products/[id]/updater';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const product = await fetch(endpoint(`/v1/products/${id}`)).then(
    (res) => res.json() as Promise<MarketProductWithShortUser | undefined>,
  );

  // type check

  if (!product) {
    console.error('Failed to fetch product');
    return {
      title: '오류',
      description: '이 페이지에 접근할 수 없습니다 ):',
      openGraph: {
        siteName: 'MC-Market',
        title: '오류',
        description: '이 페이지에 접근할 수 없습니다 ):',
        type: 'website',
        url: `https://mc-market.kr/articles/${id}`,
      },
    } as Metadata;
  }

  const title = product.name;
  const description = `[${product.created_at}] - ${product.creator?.nickname || 'Not Found'}님이 제작한 ${product.name}, ${product.price}원 ${product.description}`;
  const images =
    product.details
      ?.match(/<img[^>]+src="([^">]+)"/g)
      ?.map((imgTag) => {
        const match = imgTag.match(/src="([^">]+)"/);
        return match ? match[1] : null;
      })
      .filter(Boolean) || [];

  return {
    title,
    description,
    openGraph: {
      siteName: 'MC-Market',
      title,
      description,
      type: 'website',
      authors: [product.creator?.nickname],
      url: `https://mc-market.kr/articles/${id}`,
      images,
    },
  } as Metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const id = (await params).id;
  const product = await fetch(endpoint(`/v1/products/${id}`)).then(
    (res) => res.json() as Promise<MarketProductWithShortUser | undefined>,
  );
  const purchased =
    session &&
    (await authFetch(session, endpoint(`/v1/products/${id}/purchase`))
      .then((it) => it.text())
      .then((it) => it == 'true'));

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
      <PageUpdater initialProduct={product} initialPurchased={!!purchased} />
    </div>
  );
}
