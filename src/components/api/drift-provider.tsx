'use client';

import { MarketUser } from '@/api/types';
import { ChildrenProps } from '@/util/types-props';
import { useSession } from '@/api/surge';
import useSWR from 'swr';
import { fetchMapleUser } from '@/api/market/endpoint';
import { MapleContext } from '@/api/market/context';
import { APIStatus, MarketAPI } from '@/api/market/typed';
import { ErrorScreen } from '@/components/error/error-screen';
import { APIError } from '@/api/error/type';

export function MapleProvider({
  children,
  data,
}: { data?: { user: MarketUser | null } } & ChildrenProps) {
  const session = useSession();
  const user = useSWR(session, (s) => fetchMapleUser(s), {
    fallbackData: data?.user ?? undefined,
  });
  const apiStatus = useSWR<APIStatus, APIError>('true', async () => {
    const status = await MarketAPI.checkStatus();
    if (status.error) throw status.error;
    return status.response;
  });

  if (apiStatus.error || apiStatus.data?.status == 'failed') {
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
    <MapleContext.Provider
      value={{
        user: user.data,
        updateUser: user.mutate,
        revalidateUser() {
          void user.mutate();
        },
      }}
    >
      {children}
    </MapleContext.Provider>
  );
}
