/** Màn làm bài: toàn màn hình, không có thanh điều hướng để bé tập trung. */
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-dvh flex-1 flex-col bg-cream">{children}</main>;
}
