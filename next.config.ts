import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: {
      // Ảnh khuôn mặt đã cắt (WebP 512px) gửi qua server action
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
