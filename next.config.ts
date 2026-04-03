import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 型エラーを無視
  },
  eslint: {
    ignoreDuringBuilds: true, // エラーチェックを無視
  },
};

export default nextConfig;
