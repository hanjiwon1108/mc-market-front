import createMDX from '@next/mdx';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**', port: '' },
      { protocol: 'http', hostname: 'api.dev.entropi.kr' },
      { protocol: 'http', hostname: process.env.NEXT_PUBLIC_API_HOST ?? '' },
    ],
    dangerouslyAllowSVG: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withMDX = createMDX({});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
