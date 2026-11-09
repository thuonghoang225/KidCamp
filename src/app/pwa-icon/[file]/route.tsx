import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";
import { brandColors } from "@/lib/brand";

/** Icon PNG cho manifest (Android): 192, 512 và bản "maskable" chừa vùng an toàn để launcher cắt tròn/bo góc. */
const FILES = {
  "192.png": { px: 192, maskable: false },
  "512.png": { px: 512, maskable: false },
  "maskable-512.png": { px: 512, maskable: true },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(FILES).map((file) => ({ file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const spec = FILES[(await params).file as keyof typeof FILES];
  if (!spec) notFound();
  const { px, maskable } = spec;
  // Maskable: thu biểu tượng còn 80% trên nền xanh để mặt trời không bị cắt mất
  const inner = maskable ? Math.round(px * 0.8) : px;
  return new ImageResponse(
    (
      <div style={{ width: px, height: px, display: "flex", alignItems: "center", justifyContent: "center", background: brandColors.forest600 }}>
        <LogoMark rounded={false} px={inner} />
      </div>
    ),
    { width: px, height: px },
  );
}
