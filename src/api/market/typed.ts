import { endpoint } from '@/api/market/endpoint';
import { APIResponse } from '@/api/error/type';

export class MarketAPI {
  static async checkStatus(): Promise<
    APIResponse<{
      status: 'available' | 'failed';
      version: string;
      uptime: string;
    }>
  > {
    try {
      const response = await fetch(endpoint(`/status`));
      if (!response.ok) {
        return { error: { status: response.status, message: response.statusText } };
      }

      return { response: await response.json() };
    } catch (error: unknown) {
      return { error: { message: (error as TypeError).message } };
    }
  }
}
