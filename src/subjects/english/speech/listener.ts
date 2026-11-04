"use client";

/** Nghe bé nói và trả về chữ, dùng Web Speech API của trình duyệt. */
export interface Listener {
  isSupported(): boolean;
  listen(opts?: { expected?: string[]; timeoutMs?: number }): Promise<{ transcript: string; confidence: number }>;
  abort(): void;
}

type RecognitionCtor = new () => SpeechRecognitionLike;
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

function ctor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class ListenError extends Error {
  constructor(public code: "not-supported" | "no-speech" | "not-allowed" | "network" | "aborted" | "other") {
    super(code);
  }
}

export function createListener(lang = "en-US"): Listener {
  let current: SpeechRecognitionLike | null = null;
  return {
    isSupported: () => ctor() !== null,
    listen(opts) {
      const C = ctor();
      if (!C) return Promise.reject(new ListenError("not-supported"));
      return new Promise((resolve, reject) => {
        const rec = new C();
        current = rec;
        rec.lang = lang;
        rec.interimResults = false;
        rec.continuous = false;
        rec.maxAlternatives = 5;
        let done = false;
        const limit = opts?.timeoutMs ?? 7000;
        const timer = setTimeout(() => rec.stop(), limit);
        // Một số trình duyệt không gọi onend sau stop(): tự kết thúc để bé không bị kẹt
        const hardStop = setTimeout(() => {
          if (done) return;
          done = true;
          try { rec.abort(); } catch {}
          reject(new ListenError("no-speech"));
        }, limit + 2000);
        rec.onresult = (e) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          clearTimeout(hardStop);
          // Lấy phương án gần câu mẫu nhất trong các phương án nhận diện
          const alts = Array.from(e.results[0] ?? []);
          const expected = (opts?.expected ?? []).map((s) => s.toLowerCase());
          const best =
            alts.find((a) => expected.some((x) => x.replace(/[^a-z ]/g, "").includes(a.transcript.toLowerCase().trim()))) ?? alts[0];
          resolve({ transcript: best?.transcript ?? "", confidence: best?.confidence ?? 0 });
        };
        rec.onerror = (e) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          clearTimeout(hardStop);
          const map: Record<string, ListenError["code"]> = {
            "no-speech": "no-speech", "not-allowed": "not-allowed", "service-not-allowed": "not-allowed",
            network: "network", aborted: "aborted",
          };
          reject(new ListenError(map[e.error] ?? "other"));
        };
        rec.onend = () => {
          clearTimeout(timer);
          clearTimeout(hardStop);
          if (!done) {
            done = true;
            reject(new ListenError("no-speech"));
          }
          current = null;
        };
        rec.start();
      });
    },
    abort() {
      current?.abort();
    },
  };
}

export const listener = createListener();
