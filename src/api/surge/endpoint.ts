export function getSurgeURL() {
  return process.env['NEXT_PUBLIC_SURGE_URL'];
}

export function surgeEndpoint(endpoint: string) {
  const href = new URL(endpoint, getSurgeURL()).href;
  return href.replace(/^\/+|\/+$/g, '');
}
