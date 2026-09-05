import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  allowedDevOrigins: ['127.0.0.1', 'localhost']
};


module.exports = nextConfig;

export default nextConfig;
