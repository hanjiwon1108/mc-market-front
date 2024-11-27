import { Sonyflake } from '@/api/types/sonyflake';

export type MarketProduct = {
  id: Sonyflake;

  creator: Sonyflake;

  category: string;

  name: string;
  description: string;
  usage: string;
  tags: string[];

  price: string;
  discountPrice?: string;
  discountRate?: number;

  likes: number;
  downloads: number;

  created_at: Date;
  updated_at: Date;
};

export type MarketProductWithShortUser = Omit<MarketProduct, "creator"> & {
  creator: {
    id: Sonyflake;
    nickname?: string;
  }
}