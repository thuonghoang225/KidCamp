import type { MetadataRoute } from "next";
import { brandColors } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KidCamp",
    short_name: "KidCamp",
    description: "Trại học của bé: Tiếng Anh lớp 4 theo Global Success, luyện nói phản xạ mỗi ngày.",
    start_url: "/",
    display: "standalone",
    background_color: brandColors.cream,
    theme_color: brandColors.forest600,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
