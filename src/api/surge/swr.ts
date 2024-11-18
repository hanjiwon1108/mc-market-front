import useSWR, { Key } from 'swr';
import { useSession } from '@/api/surge/context';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { authFetch } from '@/api/surge/fetch';
import { Session } from '@entropi-co/surge-js';
// import { AxiosError, AxiosRequestConfig } from 'axios';
// import { DriftAxiosError } from '@/api/market/error';

export function useAuthSWR<
  Data extends object = never,
  Error extends object = never,
>(url?: string, init?: RequestInit) {
  const session = useSession();

  return useSWR<Data, Error, [Session | null, string | undefined]>(
    [session, url],
    ([s, u]) => {
      return new Promise((resolve, reject) => {
        if (!u || !s) return reject();
        authFetch(s, u, init)
          .then((it) => it.json())
          .then((it) => resolve(it))
          .catch((e) => {
            console.log(e);
          });
      });
    },
  );
}

export function useAuthSWRv2<
  Data extends object = never,
  Error extends object = never,
>(url: RequestInfo | URL, init?: RequestInit) {
  const session = useSession(); // Get session data

  return useSWR<Data, Error>(url, async (u: RequestInfo | URL) => {
    const response = await fetch(u, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${session?.access_token}`, // Using session internally
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  });
}

export function useAuthSWRMutation<
  Data extends object,
  Error extends object,
  K extends Key,
  ExtraArgs,
>(
  data: K,
  fetcher: (session: Session, k: K, args: ExtraArgs) => Data | Promise<Data>,
  config?: SWRMutationConfiguration<
    Data,
    Error,
    [Session | null, K],
    ExtraArgs
  > & { throwOnError?: boolean },
) {
  const session = useSession();

  return useSWRMutation(
    [session, data],
    async ([s, d]: [Session | null, K], options) => {
      if (!s) {
        return Promise.reject('Unauthorized');
      }

      try {
        return await fetcher(s, d, options.arg);
      } catch (e: unknown) {
        return Promise.reject(e);
      }
    },
    {
      throwOnError: false,
      ...config,
    },
  );
}

export type RequestMethod =
  | 'get'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete';

// export function useAuthSWRMutationJson<
//   Payload extends object = never,
//   Data extends object = never,
//   Error extends AxiosError = DriftAxiosError<Payload>,
// >(
//   url: string,
//   method: RequestMethod = 'post',
//   init?: AxiosRequestConfig<Payload>,
//   config?: SWRMutationConfiguration<
//     Data,
//     Error & { payload: Data },
//     [Session | null, string],
//     Payload & { _urlOverride?: string }
//   > & {
//     throwOnError?: boolean;
//   },
// ) {
//   return useAuthSWRMutation<
//     Data,
//     Error & { payload: Data },
//     string,
//     Payload & { _urlOverride?: string }
//   >(
//     url,
//     async (session, u, { _urlOverride, ...payload }) => {
//       try {
//         const res = await authAxios<Omit<Payload, '_urlOverride'>, Data>(
//           _urlOverride ?? u,
//           session,
//           {
//             ...init,
//             method: init?.method ?? method,
//             data: payload,
//           },
//         );
//
//         return res.data;
//       } catch (e: unknown) {
//         const error = e as AxiosError;
//         throw {
//           ...error,
//           payload: payload,
//         } as DriftAxiosError<Payload>;
//       }
//     },
//     { ...config },
//   );
// }
