import { Sonyflake } from '@/api/types/sonyflake';

export type MarketUser = MarketUserShort;

export type MarketUserShort = {
  id: Sonyflake;
  nickname: string;
};
