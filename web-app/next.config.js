/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/uploads/*",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "*",
      },
    ],
  },
};

module.exports = nextConfig;
