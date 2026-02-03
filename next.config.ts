import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000', // Matches your Minio/S3 port
        pathname: '/costria-rent-assets/**', // Matches your bucket path
      },
    ],
  },
};

export default nextConfig;
