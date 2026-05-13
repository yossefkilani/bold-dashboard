/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2", "basic-ftp"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "boldbrand.io" },
      { protocol: "https", hostname: "**.hstgr.io" },
    ],
  },
};

export default nextConfig;
