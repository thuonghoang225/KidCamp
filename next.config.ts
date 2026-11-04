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
  // Âm thanh và hình tĩnh ít đổi: cho trình duyệt và CDN của Vercel giữ 7 ngày,
  // hết hạn vẫn dùng bản cũ trong lúc tải bản mới (không phải hỏi lại server mỗi lần)
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }];
    return [
      { source: "/audio/:path*", headers: cache },
      { source: "/img/:path*", headers: cache },
      // Danh sách câu có âm thanh đổi khi thêm bài: chỉ giữ 5 phút (luật sau ghi đè luật trước)
      { source: "/audio/manifest.json", headers: [{ key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" }] },
    ];
  },
  experimental: {
    serverActions: {
      // Ảnh khuôn mặt đã cắt (WebP 512px) gửi qua server action
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
