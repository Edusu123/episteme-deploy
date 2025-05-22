export default {
  reactStrictMode: false,
  env: {
    API_BASE_URL: process.env.API_BASE_URL
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      }
    ]
  },
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
