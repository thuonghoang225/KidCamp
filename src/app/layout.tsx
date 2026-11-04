import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";
import { brandColors } from "@/lib/brand";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: { default: "KidCamp", template: "%s · KidCamp" },
  description: "Trại học của bé: Tiếng Anh lớp 4 theo Global Success, luyện nói phản xạ mỗi ngày.",
  appleWebApp: { capable: true, title: "KidCamp", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: brandColors.forest600,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
