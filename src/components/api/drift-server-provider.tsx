'use server';

import { MapleProvider } from './drift-provider';
import { ChildrenProps } from '@/util/types-props';
import { getMapleUser } from '@/api/market/cache';
import { MarketAPI } from '@/api/market/typed';
import { ErrorScreen } from '@/components/error/error-screen';

export async function DriftServerProvider({ children }: ChildrenProps) {
  const apiStatus = await MarketAPI.checkStatus();
  const user = await getMapleUser();

  if (apiStatus.error || apiStatus.response.status == 'failed') {
    return (
      <div className="h-screen overflow-hidden">
        <div className="fixed z-[100000] flex h-screen w-screen">
          <ErrorScreen
            className="bg-background/30 backdrop-blur-xl"
            title="API Failure"
          >
            네트워크 또는 서버가 실패했습니다. <br />
            해결되지 않으면 관리자에게 문의하십시오.
            <br />
            <br />
            {apiStatus.error ? (
              <>
                {apiStatus.error.status} {apiStatus.error.message}
              </>
            ) : (
              <>{`API Status is 'failed'`}</>
            )}
          </ErrorScreen>
        </div>
        {children}
      </div>
    );
  }

  return (
    <MapleProvider
      data={{
        user: user ?? null,
      }}
    >
      {children}
    </MapleProvider>
  );
}
