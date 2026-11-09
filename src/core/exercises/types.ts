import type { ExerciseKind } from "@content/schema";

export type Choice = { id: string; label: string; image?: string; audio?: string };

type Base<K extends ExerciseKind | "dialogue-turn"> = {
  /** Khóa duy nhất trong buổi học. */
  key: string;
  kind: K;
  /** Item được ôn (`w.*`, `s.*`); `null` = không đưa vào lịch ôn (chant, âm). */
  itemId: string | null;
};

export type ListenPickImage = Base<"listen-pick-image"> & { audio: string; options: Choice[]; answerId: string };
export type ImagePickWord = Base<"image-pick-word"> & { image: string; options: Choice[]; answerId: string };
export type SpellWord = Base<"spell-word"> & { image: string; audio: string; answer: string; tiles: string[]; hint?: string };
export type SayWord = Base<"say-word"> & { text: string; image?: string; meaning?: string; accept: string[] };
export type PickAnswer = Base<"pick-answer"> & { question: string; image?: string; options: Choice[]; answerId: string };
export type OrderWords = Base<"order-words"> & { question: string; image?: string; answer: string; tiles: string[] };
export type SaySentence = Base<"say-sentence"> & { question: string; image?: string; model: string; accept: string[] };
export type Chant = Base<"chant"> & { title: string; lines: Array<{ text: string; gap?: string }> };
/** `example`: từ mẫu chứa âm (từ cuối của hint, vd. "here"), phát khi bé bấm nghe âm. */
export type PickSound = Base<"pick-sound"> & { sound: string; hint: string; example: string; options: Choice[]; answerId: string };

export type Exercise =
  | ListenPickImage
  | ImagePickWord
  | SpellWord
  | SayWord
  | PickAnswer
  | OrderWords
  | SaySentence
  | Chant
  | PickSound;

/** Câu trả lời của bé, gửi lên server để chấm lại và lưu. */
export type Response =
  | { type: "choice"; choiceId: string }
  | { type: "text"; text: string }
  | { type: "speech"; transcript: string; selfReported?: boolean }
  | { type: "done" };

export type Grade = {
  correct: boolean;
  score: number;
  /** Đáp án đúng để hiển thị lại cho bé. */
  expected: string;
};
