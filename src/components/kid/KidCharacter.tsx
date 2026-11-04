import { HEAD_SLOT, getCostume } from "@content/characters/costumes";
import { clsx } from "clsx";

type Pose = "stand" | "wave" | "cheer";

/**
 * Nhân vật của bé: thân hoạt hình + ảnh khuôn mặt đã cắt đặt vào ô đầu.
 * Không có ảnh thì dùng mặt hoạt hình mặc định.
 */
export function KidCharacter({
  faceUrl, costumeId = "camper", pose = "stand", className, label = "Nhân vật của bé", active = false,
}: { faceUrl?: string | null; costumeId?: string; pose?: Pose; className?: string; label?: string; active?: boolean }) {
  const c = getCostume(costumeId);
  const clipId = `face-${costumeId}-${pose}`;
  const { cx, cy, r } = HEAD_SLOT;
  const leftArm = pose === "cheer" ? "M62 150 L34 104" : "M62 150 L44 200";
  const rightArm = pose === "wave" || pose === "cheer" ? "M138 150 L168 104" : "M138 150 L156 200";

  return (
    <svg viewBox="0 0 200 260" role="img" aria-label={label} className={clsx("drop-shadow-sm", active && "animate-[bounce_1.2s_ease-in-out_infinite]", className)}>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {active && <circle cx={cx} cy={150} r={98} fill="#ffdb66" opacity="0.35" />}
      {/* chân */}
      <rect x="72" y="196" width="22" height="50" rx="10" fill={c.pants} />
      <rect x="106" y="196" width="22" height="50" rx="10" fill={c.pants} />
      <ellipse cx="82" cy="248" rx="16" ry="8" fill="#3b2a1a" />
      <ellipse cx="118" cy="248" rx="16" ry="8" fill="#3b2a1a" />
      {/* tay */}
      <path d={leftArm} stroke={c.shirt} strokeWidth="18" strokeLinecap="round" />
      <path d={rightArm} stroke={c.shirt} strokeWidth="18" strokeLinecap="round" />
      <circle cx={pose === "cheer" ? 34 : 44} cy={pose === "cheer" ? 104 : 200} r="10" fill="#f6c9a0" />
      <circle cx={pose === "stand" ? 156 : 168} cy={pose === "stand" ? 200 : 104} r="10" fill="#f6c9a0" />
      {/* thân */}
      <rect x="58" y="122" width="84" height="84" rx="26" fill={c.shirt} />
      <path d="M86 124 L100 146 L114 124" fill={c.accent} />
      {costumeId === "camper" && <rect x="132" y="132" width="20" height="56" rx="8" fill="#b9813f" />}
      <circle cx="100" cy="170" r="6" fill={c.accent} />
      {/* đầu */}
      <circle cx={cx} cy={cy} r={r + 4} fill="#ffffff" />
      {faceUrl ? (
        <image href={faceUrl} x={cx - r} y={cy - r} width={r * 2} height={r * 2} clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <g>
          <circle cx={cx} cy={cy} r={r} fill="#f6c9a0" />
          <path d={`M${cx - r} ${cy - 6} Q${cx} ${cy - r - 22} ${cx + r} ${cy - 6} Q${cx + 20} ${cy - 30} ${cx - r} ${cy - 6}`} fill="#3b2a1a" />
          <circle cx={cx - 16} cy={cy + 6} r="5" fill="#1f2a24" />
          <circle cx={cx + 16} cy={cy + 6} r="5" fill="#1f2a24" />
          <path d={`M${cx - 14} ${cy + 22} Q${cx} ${cy + 34} ${cx + 14} ${cy + 22}`} stroke="#1f2a24" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx={cx - 28} cy={cy + 18} r="7" fill="#f4a2a2" opacity="0.6" />
          <circle cx={cx + 28} cy={cy + 18} r="7" fill="#f4a2a2" opacity="0.6" />
        </g>
      )}
      {c.hat === "ranger" && (
        <g>
          <ellipse cx={cx} cy={cy - r + 6} rx={r + 18} ry="10" fill="#8a5a2b" />
          <path d={`M${cx - 30} ${cy - r + 6} Q${cx} ${cy - r - 34} ${cx + 30} ${cy - r + 6}Z`} fill="#a86f35" />
          <rect x={cx - 30} y={cy - r - 2} width="60" height="7" fill={c.accent} />
        </g>
      )}
      {c.hat === "cap" && (
        <g>
          <path d={`M${cx - 40} ${cy - r + 14} Q${cx} ${cy - r - 26} ${cx + 40} ${cy - r + 14}Z`} fill={c.shirt} />
          <rect x={cx + 10} y={cy - r + 8} width="52" height="10" rx="5" fill={c.shirt} />
        </g>
      )}
    </svg>
  );
}
