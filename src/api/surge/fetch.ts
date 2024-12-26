import { Session } from '@entropi-co/surge-js';

export function authFetch(
  session: Session | undefined | null,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: session
      ? {
          ...init?.headers,
          Authorization: `Bearer ${session.access_token}`,
        }
      : init?.headers,
  });
}
