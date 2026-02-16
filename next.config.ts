import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://aroxjblog.am/wp-content/uploads/**"), new URL("https://nnqeytgn7ealljhf.public.blob.vercel-storage.com/**")],
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose"], 
  },
  
  webpack: (config) => {
 
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
