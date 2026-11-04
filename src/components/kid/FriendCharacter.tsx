import { clsx } from "clsx";

/** Bạn đồng hành trong hội thoại (nhân vật hoạt hình tự vẽ). */
export function FriendCharacter({ name = "Lucy", className, active = false }: { name?: string; className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 200 260" role="img" aria-label={name} className={clsx(active && "animate-[bounce_1.2s_ease-in-out_infinite]", className)}>
      {active && <circle cx="100" cy="150" r="98" fill="#a9e3bd" opacity="0.45" />}
      <rect x="74" y="196" width="20" height="50" rx="10" fill="#2b8fe0" />
      <rect x="106" y="196" width="20" height="50" rx="10" fill="#2b8fe0" />
      <path d="M62 150 L46 198 M138 150 L164 110" stroke="#ffc933" strokeWidth="18" strokeLinecap="round" />
      <circle cx="46" cy="198" r="10" fill="#f9d7b5" />
      <circle cx="164" cy="110" r="10" fill="#f9d7b5" />
      <path d="M60 206 Q100 112 140 206Z" fill="#ffc933" />
      <rect x="64" y="122" width="72" height="70" rx="24" fill="#ffc933" />
      <path d="M44 84 Q40 150 70 150 L70 60Z M156 84 Q160 150 130 150 L130 60Z" fill="#e59a2f" />
      <circle cx="100" cy="76" r="48" fill="#f9d7b5" />
      <path d="M52 70 Q100 10 148 70 Q120 44 100 52 Q80 44 52 70Z" fill="#e59a2f" />
      <circle cx="84" cy="80" r="5.5" fill="#1f2a24" />
      <circle cx="116" cy="80" r="5.5" fill="#1f2a24" />
      <path d="M86 98 Q100 110 114 98" stroke="#1f2a24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="72" cy="94" r="7" fill="#f4a2a2" opacity="0.6" />
      <circle cx="128" cy="94" r="7" fill="#f4a2a2" opacity="0.6" />
    </svg>
  );
}
