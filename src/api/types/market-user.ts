import { Sonyflake } from '@/api/types/sonyflake';

export type MarketUser = {
  id: Sonyflake;
  nickname: string;

  permissions: number;

  cash: number;

  created_at: number;
  updated_at: number;
};

export type MarketUserShort = Pick<MarketUser, 'id' | 'nickname'>;
