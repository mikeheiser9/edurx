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
    "types": ["three"]
  },
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });

  //   return config; // This line is important to return the modified config
  // },
};

module.exports = nextConfig;
