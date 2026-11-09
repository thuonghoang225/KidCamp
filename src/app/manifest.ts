import type { MetadataRoute } from "next";
import { brandColors } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "KidCamp",
    short_name: "KidCamp",
    description: "Trại học của bé: Tiếng Anh lớp 4 theo Global Success, luyện nói phản xạ mỗi ngày.",
    // Mở thẳng trang thật, không qua "/" (trang "/" chỉ là một lệnh chuyển hướng có thân trắng,
    // mở từ biểu tượng màn hình chính dễ kẹt lại ở trang trắng)
    start_url: "/home",
    scope: "/",
    display: "standalone",
    background_color: brandColors.cream,
    theme_color: brandColors.forest600,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      // Android cần icon PNG 192 và 512 mới cài thành app thật (có màn chào), không chỉ là lối tắt
      { src: "/pwa-icon/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
