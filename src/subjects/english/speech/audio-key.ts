/**
 * Khóa file âm thanh của một câu: FNV-1a 32-bit trên câu đã chuẩn hóa khoảng trắng.
 * scripts/generate-audio.py dùng đúng thuật toán này để đặt tên file.
 */
export function audioKey(text: string): string {
  const s = text.trim().replace(/\s+/g, " ");
  let h = 0x811c9dc5;
  const bytes = new TextEncoder().encode(s);
  for (const b of bytes) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/**
 * Danh mục giọng đọc. File của giọng nằm ở public/audio/<id>/.
 * - Kokoro: mã nguồn mở, tạo bằng scripts/generate-audio.py.
 * - Azure: tạo bằng scripts/generate-audio-azure.mts (cần key Azure Speech, gói miễn phí đủ dùng).
 * App chỉ cho chọn giọng đã có file (manifest.json).
 */
export const VOICE_CATALOG = [
  { id: "heart", label: "Heart", gender: "nữ", provider: "kokoro", engineVoice: "af_heart" },
  { id: "bella", label: "Bella", gender: "nữ", provider: "kokoro", engineVoice: "af_bella" },
  { id: "michael", label: "Michael", gender: "nam", provider: "kokoro", engineVoice: "am_michael" },
  { id: "azure-ana", label: "Ana (giọng bé gái)", gender: "nữ", provider: "azure", engineVoice: "en-US-AnaNeural" },
  { id: "azure-jenny", label: "Jenny", gender: "nữ", provider: "azure", engineVoice: "en-US-JennyNeural" },
  { id: "azure-aria", label: "Aria", gender: "nữ", provider: "azure", engineVoice: "en-US-AriaNeural" },
  { id: "azure-guy", label: "Guy", gender: "nam", provider: "azure", engineVoice: "en-US-GuyNeural" },
] as const;

export type Voice = (typeof VOICE_CATALOG)[number]["id"];
/** Giọng luân phiên mặc định (Kokoro, luôn có sẵn trong repo). */
export const VOICES: Voice[] = ["heart", "bella", "michael"];
/** Giọng nữ, dùng cho bạn Lucy trong hội thoại khi đang luân phiên. */
export const FRIEND_VOICES: Voice[] = ["heart", "bella"];

/** Lựa chọn của phụ huynh: một giọng cố định, hoặc luân phiên các giọng Kokoro. */
export type VoicePreference = Voice | "rotate";
export const isVoicePreference = (v: string): v is VoicePreference => v === "rotate" || VOICE_CATALOG.some((x) => x.id === v);

/** Câu hệ thống được app nói (ngoài nội dung bài học). */
export const SYSTEM_PHRASES = [
  "Excellent!",
  "Good job!",
  "Try again!",
  "Hi! Let's talk. Answer quickly!",
  "Great job! See you!",
];
