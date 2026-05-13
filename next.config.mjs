/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["mysql2", "basic-ftp"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "boldbrand.io" },
    ],
  },
};

export default nextConfig;
