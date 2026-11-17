const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true }
      }
    : {
        async redirects() {
          return [
            {
              source: '/about',
              destination: '/about-us',
              permanent: true
            },
            {
              source: '/all-diamonds',
              destination: '/diamonds',
              permanent: true
            },
            {
              source: '/custom-ring',
              destination: '/create-your-own',
              permanent: true
            },
            {
              source: '/contact-us',
              destination: '/contact',
              permanent: true
            },
            {
              source: '/terms-and-conditions',
              destination: '/terms',
              permanent: true
            },
            {
              source: '/privacy-policy',
              destination: '/privacy',
              permanent: true
            }
          ];
        }
      })
};

export default nextConfig;
