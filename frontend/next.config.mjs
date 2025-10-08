/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qvkzwudrgnyfwvvpfqxb.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Proxy API requests to chatbot backend to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: '/api/chatbot/:path*',
        destination: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:5000/:path*',
      },
    ];
  },
};

export default nextConfig;
