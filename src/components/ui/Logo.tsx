import { clsx } from "clsx";
import { brandColors as c } from "@/lib/brand";

/** Biểu tượng KidCamp: lều trại dưới mặt trời. Bản file tĩnh: src/app/icon.svg */
export function LogoMark({ className, rounded = true, px }: { className?: string; rounded?: boolean; px?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={px} height={px} className={className} aria-hidden="true">
      <rect width="64" height="64" rx={rounded ? 16 : 0} fill={c.forest600} />
      <circle cx="47" cy="18" r="7" fill={c.sun400} />
      <path d="M32 15 52 50H12Z" fill={c.cream} />
      <path d="M32 30 40 50H24Z" fill={c.forest700} />
      <rect x="8" y="49" width="48" height="4" rx="2" fill={c.forest200} />
    </svg>
  );
}

const sizes = {
  md: { mark: "size-9", text: "text-xl" },
  xl: { mark: "size-16", text: "text-5xl" },
} as const;

/** Logo đầy đủ: biểu tượng + chữ "KidCamp" (Kid xanh rừng, Camp cam lửa trại). */
export function Logo({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <LogoMark className={sizes[size].mark} />
      <span className={clsx("font-black tracking-tight", sizes[size].text)}>
        <span className="text-forest-700">Kid</span>
        <span className="text-ember-600">Camp</span>
      </span>
    </span>
  );
}
