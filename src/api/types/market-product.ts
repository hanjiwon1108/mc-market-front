import { Sonyflake } from '@/api/types/sonyflake';

export type MarketProduct = {
  id: Sonyflake;

  creator: Sonyflake;

  category: string;

  name: string;
  description: string;
  usage: string;
  tags: string[];

  price: number;
  price_discount?: number;

  likes: number;
  downloads: number;

  created_at: string;
  updated_at: string;
};

export type MarketProductId = {
  id: Sonyflake;
};

export type MarketProductWithShortUser = Omit<MarketProduct, 'creator'> & {
  creator: {
    id: Sonyflake;
    nickname?: string;
    username?: string;
  };
};
