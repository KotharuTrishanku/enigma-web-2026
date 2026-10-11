import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", },
        {
          protocol: "https",
          hostname: "enigma-iiits.in"
        }
    ],
  },
};

export default nextConfig;