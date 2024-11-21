import { Sonyflake } from '@/api/types/sonyflake';

export type MarketUser = {
  id: Sonyflake;
  nickname: string;

  permissions: number;
};

export type MarketUserShort = Pick<MarketUser, 'id' | 'nickname'>;
