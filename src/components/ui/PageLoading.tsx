/** Khung chờ hiện ngay khi bé bấm chuyển trang, trong lúc server tải dữ liệu. */
export function PageLoading({ label = "Đang mở…" }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20" role="status" aria-live="polite">
      <div className="size-14 animate-spin rounded-full border-[6px] border-forest-100 border-t-forest-600" />
      <p className="text-lg font-bold text-muted">{label}</p>
    </div>
  );
}
