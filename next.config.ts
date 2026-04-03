import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! 警告 !!
    // プロジェクトに型エラーがあっても、ビルドを強制的に進めます。
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintチェックもスキップ
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;