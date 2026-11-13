import { levenshtein, words } from "./text";

export const SPEECH_PASS = 0.8;

/** Từ nhỏ không bắt buộc khi chấm nói. */
const OPTIONAL = new Set(["a", "an", "the"]);

export type SpeechScore = {
  score: number; // 0..1
  passed: boolean;
  expected: string;
  /** Từng từ của câu mẫu và bé đã nói khớp chưa (để tô xanh / cam). */
  words: Array<{ word: string; matched: boolean }>;
};

function wordMatches(target: string, said: string): boolean {
  if (target === said) return true;
  return target.length >= 5 && levenshtein(target, said) <= 1;
}

function scoreOne(transcript: string, expected: string): SpeechScore {
  const said = words(transcript);
  const target = words(expected);
  const used = new Array(said.length).fill(false);
  const marks = target.map((w) => {
    const idx = said.findIndex((s, i) => !used[i] && wordMatches(w, s));
    if (idx >= 0) used[idx] = true;
    return { word: w, matched: idx >= 0 };
  });
  // Mạo từ (a, an, the) máy nhận giọng hay nuốt mất: thiếu thì không trừ điểm, vẫn tô để bé thấy
  const required = marks.filter((m) => !OPTIONAL.has(m.word));
  const counted = required.length ? required : marks;
  const score = counted.length ? counted.filter((m) => m.matched).length / counted.length : 0;
  return { score, passed: score >= SPEECH_PASS, expected, words: marks };
}

/** Chấm câu nói của bé so với các câu được chấp nhận; lấy kết quả tốt nhất. */
export function scoreSpeech(transcript: string, accepted: string[]): SpeechScore {
  if (accepted.length === 0) throw new Error("scoreSpeech cần ít nhất một câu mẫu");
  return accepted
    .map((a) => scoreOne(transcript, a))
    .reduce((best, cur) => (cur.score > best.score ? cur : best));
}
