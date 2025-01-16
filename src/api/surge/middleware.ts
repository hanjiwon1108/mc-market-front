import { NextRequest, NextResponse } from 'next/server';
import { createServerSurgeClient } from '@/api/surge/server';

export async function updateSurgeSession(request: NextRequest) {
  // const client = createServerClient(process.env['NEXT_PUBLIC_SURGE_URL']!, {
  //   cookies: {
  //     getAll() {
  //       return request.cookies.getAll();
  //     },
  //     setAll(toSet) {
  //       toSet.forEach((it) => request.cookies.set(it.name, it.value));
  //       response = NextResponse.next({ request });
  //       toSet.forEach((it) => response.cookies.set(it.name, it.value));
  //     },
  //   },
  // });

  await createServerSurgeClient();

  return NextResponse.next({
    request,
  });
}
