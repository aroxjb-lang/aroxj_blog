import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://aroxjblog.am/wp-content/uploads/**'), new URL('https://nnqeytgn7ealljhf.public.blob.vercel-storage.com/**'), new URL('http://70.34.199.105/en/uploads'), new URL('https://aroxjblog.am/uploads/**')],
        unoptimized: true,
    }, experimental: {
        serverComponentsExternalPackages: ['mongoose'],
    },

    webpack: (config) => {

        return config;
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
