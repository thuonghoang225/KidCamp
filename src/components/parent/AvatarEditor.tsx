"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteAvatar, uploadAvatar } from "@/server/actions/parent";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faCamera, faCheck, faTrash } from "@/components/icons";

const OUT = 512; // kích thước ảnh khuôn mặt lưu lại
const VIEW = 240; // khung cắt trên màn hình
// Ảnh điện thoại thường chụp cả người: cho phóng tới 10 lần để khuôn mặt lấp đầy vòng tròn
const MAX_ZOOM = 10;

/**
 * Chọn / chụp ảnh, kéo và phóng to để khuôn mặt nằm trong vòng tròn, rồi cắt ngay
 * trên trình duyệt. Chỉ ảnh khuôn mặt đã cắt (WebP 512px) được gửi lên server.
 */
export function AvatarEditor({ childId, costumeId, currentFace }: { childId: string; costumeId: string; currentFace: string | null }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [pending, start] = useTransition();
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    let source: Blob = file;
    // Ảnh chụp từ iPhone (HEIC): chuyển sang PNG (không mất chất lượng) ngay trên trình duyệt.
    // Bộ chuyển đổi (~3MB) chỉ được tải khi cần, không làm nặng các trang khác.
    if (/\.(heic|heif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type)) {
      setConverting(true);
      try {
        let heicTo: typeof import("heic-to/next").heicTo;
        try {
          ({ heicTo } = await import("heic-to/next"));
        } catch (e) {
          console.error("Không tải được bộ chuyển HEIC (đã chạy pnpm install chưa?)", e);
          setError("Chưa tải được bộ chuyển ảnh HEIC. Thử tải lại trang; nếu vẫn lỗi, chạy lại pnpm install.");
          return;
        }
        try {
          source = await heicTo({ blob: file, type: "image/png" });
        } catch (e) {
          console.error("Chuyển HEIC thất bại", e);
          setError("Không chuyển được ảnh HEIC này. Hãy xuất ảnh sang PNG hoặc JPG rồi chọn lại.");
          return;
        }
      } finally {
        setConverting(false);
      }
    }
    const url = URL.createObjectURL(source);
    const im = new Image();
    im.onload = () => {
      URL.revokeObjectURL(url);
      setImg(im);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    im.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Không đọc được ảnh này. Hãy chọn ảnh JPG, PNG hoặc HEIC.");
    };
    im.src = url;
  }

  // Vẽ khung cắt + tạo ảnh xem trước
  useEffect(() => {
    if (!img || !canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    const base = Math.max(VIEW / img.width, VIEW / img.height) * zoom;
    const w = img.width * base;
    const h = img.height * base;
    ctx.clearRect(0, 0, VIEW, VIEW);
    ctx.drawImage(img, (VIEW - w) / 2 + offset.x, (VIEW - h) / 2 + offset.y, w, h);
    setPreview(canvas.current.toDataURL("image/png"));
  }, [img, zoom, offset]);

  function exportFace(): Promise<Blob> {
    const out = document.createElement("canvas");
    out.width = OUT;
    out.height = OUT;
    const ctx = out.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(canvas.current!, 0, 0, OUT, OUT);
    return new Promise((resolve, reject) =>
      out.toBlob((b) => (b ? resolve(b) : reject(new Error("Không xuất được ảnh"))), "image/webp", 0.85),
    );
  }

  function save() {
    start(async () => {
      try {
        const blob = await exportFace();
        const form = new FormData();
        form.set("face", new File([blob], "face.webp", { type: blob.type || "image/webp" }));
        await uploadAvatar(childId, form);
        setImg(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không lưu được ảnh");
      }
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-black">Nhân vật có khuôn mặt bé</h2>
      <p className="text-sm text-muted">Ảnh được cắt ngay trên máy này. Chỉ phần khuôn mặt được lưu, không gửi tới AI.</p>
      <div className="flex items-center gap-4">
        {img ? (
          <div className="flex flex-col items-center gap-2">
            <canvas
              ref={canvas}
              width={VIEW}
              height={VIEW}
              className="cursor-grab touch-none rounded-full ring-4 ring-sun-300"
              style={{ width: 180, height: 180 }}
              onPointerDown={(e) => {
                (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
                drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
              }}
              onPointerMove={(e) => drag.current && setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y })}
              onPointerUp={() => (drag.current = null)}
              onWheel={(e) => setZoom((z) => Math.min(MAX_ZOOM, Math.max(1, z * (e.deltaY < 0 ? 1.1 : 1 / 1.1))))}
            />
            <label className="flex w-full items-center gap-2 text-sm font-bold">
              Phóng to
              <input type="range" min={1} max={MAX_ZOOM} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
            </label>
          </div>
        ) : null}
        <KidCharacter faceUrl={img ? preview : currentFace} costumeId={costumeId} pose="wave" className="h-48 w-36" />
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="btn-candy inline-flex h-12 cursor-pointer items-center gap-2 rounded-2xl bg-sky-600 px-5 font-extrabold text-white hover:bg-sky-700">
          <Icon icon={faCamera} /> {currentFace ? "Đổi ảnh" : "Chọn / chụp ảnh"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            className="sr-only"
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = ""; // chọn lại cùng một ảnh vẫn kích hoạt
            }}
          />
        </label>
        {img && <Button onClick={save} disabled={pending}><Icon icon={faCheck} /> Lưu nhân vật</Button>}
        {!img && currentFace && (
          <Button tone="white" disabled={pending} onClick={() => start(() => deleteAvatar(childId))}>
            <Icon icon={faTrash} /> Xóa ảnh
          </Button>
        )}
      </div>
      {converting && <p className="font-bold text-sky-700 animate-pulse">Đang xử lý ảnh từ iPhone…</p>}
      {error && <p className="font-bold text-ember-600">{error}</p>}
    </div>
  );
}
