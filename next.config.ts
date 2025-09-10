import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['9000-firebase-studio-1757487297118.*', '*.cloudworkstations.dev', '9000-firebase-studio-1757487297118.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev'],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      // Extend the timeout for server actions to 5 minutes for video generation
      serverActionsTimeout: 300,
    }
  }
};

export default nextConfig;
