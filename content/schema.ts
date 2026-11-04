import { z } from "zod";

/**
 * Schema chung cho mọi nội dung học. Nội dung là code: được kiểm tra khi build
 * (scripts/check-content.ts) và khi test, nên lỗi gõ ID hay thiếu hình bị bắt sớm.
 */

export const SubjectId = z.enum(["english", "math"]);
export type SubjectId = z.infer<typeof SubjectId>;

/** Một từ trong kho từ tiếng Anh dùng chung (content/english/lexicon). */
export const Word = z.object({
  id: z.string().regex(/^w\.[a-z0-9-]+$/),
  text: z.string().min(1),
  meaning: z.string().min(1),
  image: z.string().min(1),
  level: z.enum(["starters", "movers", "flyers", "textbook"]),
  topics: z.array(z.string()).default([]),
  /** Câu ví dụ ngắn dùng trên thẻ từ. */
  example: z.string().optional(),
  /** false = từ khó vẽ (thứ, tháng…): bài tập hiện chữ thay cho hình. */
  pictureable: z.boolean().default(true),
});
export type Word = z.infer<typeof Word>;
export type WordInput = z.input<typeof Word>;

/** Một mẫu câu hỏi–đáp của Unit. `{slot}` được thay bằng từ trong `slots`. */
export const Pattern = z.object({
  id: z.string().regex(/^s\.[a-z0-9-]+$/),
  question: z.string(),
  answer: z.string(),
  meaning: z.string(),
  slots: z.record(z.string(), z.array(z.string())).default({}),
  /** Cách nói thay thế được chấp nhận khi chấm nói (đã điền slot). */
  acceptAlso: z.array(z.string()).default([]),
});
export type Pattern = z.infer<typeof Pattern>;

export const ExerciseKind = z.enum([
  "listen-pick-image",
  "image-pick-word",
  "spell-word",
  "say-word",
  "pick-answer",
  "order-words",
  "say-sentence",
  "chant",
  "pick-sound",
  "mixed-quiz",
]);
export type ExerciseKind = z.infer<typeof ExerciseKind>;

export const StationId = z.enum(["words", "patterns", "chant", "sounds", "challenge"]);
export type StationId = z.infer<typeof StationId>;

export const Station = z.object({
  id: StationId,
  title: z.string(),
  subtitle: z.string(),
  exercises: z.array(ExerciseKind).min(1),
});
export type Station = z.infer<typeof Station>;

export const PhonicsSet = z.object({
  sound: z.string(),
  hint: z.string(),
  /** Từ chứa âm đích. */
  target: z.array(z.string()).min(2),
  /** Từ không chứa âm đích (làm phương án nhiễu). */
  others: z.array(z.string()).min(2),
});

export const ChantLine = z.object({ text: z.string(), gap: z.string().optional() });

export const Unit = z.object({
  /** u01…u20 cho Unit, r1…r4 cho bài Ôn tập. */
  id: z.string().regex(/^(u\d{2}|r\d)$/),
  number: z.number().int(),
  kind: z.enum(["unit", "review"]).default("unit"),
  /** Bài Ôn tập: các Unit được trộn câu hỏi. */
  includes: z.array(z.string()).default([]),
  title: z.string(),
  titleVi: z.string(),
  status: z.enum(["ready", "soon"]),
  words: z.array(z.string()).default([]),
  patterns: z.array(Pattern).default([]),
  stations: z.array(Station).default([]),
  phonics: z.array(PhonicsSet).default([]),
  chant: z
    .object({ title: z.string(), lines: z.array(ChantLine) })
    .optional(),
  /** Ghi chú cho người soạn nội dung (không hiển thị cho bé). */
  editorNote: z.string().optional(),
});
export type Unit = z.infer<typeof Unit>;
export type UnitInput = z.input<typeof Unit>;

export const Course = z.object({
  id: z.string(),
  subject: SubjectId,
  title: z.string(),
  titleVi: z.string(),
  status: z.enum(["ready", "soon"]),
  units: z.array(Unit),
});
export type Course = z.infer<typeof Course>;

/** Kịch bản hội thoại (Đóng vai, Hỏi nhanh). */
export const DialogueTurn = z.object({
  say: z.string(),
  /** Bé cần trả lời theo mẫu câu này. Bỏ trống = nhân vật chỉ nói. */
  expectPattern: z.string().optional(),
  /** Gợi ý theo bậc: [0] = câu đầy đủ, [1] = khung câu, [2] = chữ đầu. */
  hints: z.array(z.string()).default([]),
});
export const Dialogue = z.object({
  id: z.string(),
  courseId: z.string(),
  unitId: z.string(),
  title: z.string(),
  titleVi: z.string(),
  friend: z.object({ name: z.string(), country: z.string() }),
  turns: z.array(DialogueTurn).min(1),
});
export type Dialogue = z.infer<typeof Dialogue>;
/** Kiểu dùng khi soạn nội dung (các trường có giá trị mặc định được phép bỏ trống). */
export type DialogueInput = z.input<typeof Dialogue>;

export const Asset = z.object({
  key: z.string(),
  file: z.string(),
  source: z.enum(["fluent-emoji", "flag-icons", "ai-generated", "kidcamp"]),
  license: z.string(),
});
export type Asset = z.infer<typeof Asset>;

/** Nhãn hiển thị: "Unit 3" hoặc "Ôn tập 1". */
export function unitLabel(u: Pick<Unit, "kind" | "number">): string {
  return u.kind === "review" ? `Ôn tập ${u.number}` : `Unit ${u.number}`;
}

export function fillSlots(template: string, values: Record<string, string>): string {
  return template
    // "a {place}" + "art room" → "an art room"
    .replace(/\b([Aa]) \{(\w+)\}/g, (m, a: string, key: string) =>
      values[key] && /^[aeiou]/i.test(values[key]) ? `${a}n {${key}}` : m,
    )
    .replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}
