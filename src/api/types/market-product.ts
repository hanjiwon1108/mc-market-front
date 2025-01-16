import { Sonyflake } from '@/api/types/sonyflake';

export type MarketProduct = {
  id: Sonyflake;

  creator: Sonyflake;

  category: string;

  name: string;
  description: string;
  details: string;
  usage: string;
  tags: string[];

  price: number;
  price_discount?: number;

  created_at: string;
  updated_at: string;
};

export type MarketProductId = {
  id: Sonyflake;
};

export type MarketAuthor = {
  id: Sonyflake;
  nickname?: string;
  username?: string;
};
export type MarketProductWithShortUser = Omit<MarketProduct, 'creator'> & {
  creator: MarketAuthor;
};
