import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/ui/Logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icon màn hình chính iPad/iPhone: không bo góc (iOS tự bo). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <LogoMark rounded={false} px={size.width} />
    ),
    size,
  );
}
