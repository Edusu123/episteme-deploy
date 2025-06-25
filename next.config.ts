export default {
  env: {
    API_BASE_URL: process.env.API_BASE_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    minimumCacheTTL: 1
  },
  reactStrictMode: false,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false // use true if this is a permanent redirect (301)
      }
    ];
  }
};
