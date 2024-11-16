import { Sonyflake } from '@/api/types/sonyflake';

export type MarketProduct = {
  id: Sonyflake;

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

  createdAt: Date;
  updatedAt: Date;
};
