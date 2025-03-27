import createMDX from '@next/mdx';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mc-market.kr',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: '*' },
      { protocol: 'http', hostname: 'api.dev.entropi.kr' },
      { protocol: 'http', hostname: 'localhost', port: '6568' },
    ],
    dangerouslyAllowSVG: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
