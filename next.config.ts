import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScriptのエラーを無視してビルドする設定
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLintのエラー（警告など）を無視してビルドする設定
  // ※ keyを 'eslint' ではなく、何もしない空の設定にするか、
  // 下記の通り最新の形式に合わせます。
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
