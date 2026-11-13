"use client";

import { Vad } from "./vad";

/**
 * Nghe bằng micro + nhận diện trên máy chủ (Whisper, xem /api/stt).
 * - Tự biết bé bắt đầu / ngừng nói bằng âm lượng (Vad), không bị iPad tự ngắt giữa câu.
 * - Sóng âm chạy theo giọng thật của bé.
 * - Chỉ gửi đoạn có tiếng nói lên máy chủ; không có tiếng thì không gửi.
 */
export type CloudListenOptions = {
  expected?: string[];
  onReady?: () => void;
  onVoice?: (speaking: boolean) => void;
  /** Bé đã nói xong, đang chờ máy chủ nhận diện. */
  onThinking?: () => void;
};

export class CloudListenError extends Error {
  constructor(public code: "not-allowed" | "no-mic" | "no-speech" | "network" | "other", public raw?: string) {
    super(raw ? `${code} (${raw})` : code);
  }
}

let enabled: Promise<boolean> | null = null;

/** Máy chủ có bật nhận diện (đã đặt GROQ_API_KEY) và trình duyệt ghi âm được không. */
export function cloudSttAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    return Promise.resolve(false);
  }
  enabled ??= fetch("/api/stt")
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((j: { enabled?: boolean }) => Boolean(j.enabled))
    .catch(() => false);
  return enabled;
}

function pickMime(): string | undefined {
  for (const m of ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg;codecs=opus"]) {
    if (MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return undefined;
}

/** Từ vựng trong các câu đúng, gửi kèm để Whisper nghe rõ tên riêng. */
function vocabOf(expected: string[]): string {
  const seen = new Set<string>();
  for (const s of expected) for (const w of s.match(/[A-Za-z][A-Za-z']*/g) ?? []) seen.add(w);
  return [...seen].join(", ");
}

let stopCurrent: (() => void) | null = null;
let abortCurrent: (() => void) | null = null;

/** Bé bấm nút khi đã nói xong. */
export function cloudFinish() {
  stopCurrent?.();
}

export function cloudAbort() {
  abortCurrent?.();
}

export async function cloudListen(opts: CloudListenOptions = {}): Promise<{ transcript: string; confidence: number }> {
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    throw new CloudListenError(name === "NotAllowedError" || name === "SecurityError" ? "not-allowed" : "no-mic", String(err));
  }

  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  void ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const buf = new Float32Array(analyser.fftSize);

  const mime = pickMime();
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  const vad = new Vad();
  let timer: ReturnType<typeof setInterval> | undefined;

  const release = () => {
    clearInterval(timer);
    stopCurrent = null;
    abortCurrent = null;
    // Tắt micro ngay: trên iPad, micro đang mở làm loa phát nhỏ đi
    stream.getTracks().forEach((t) => t.stop());
    void ctx.close().catch(() => {});
    opts.onVoice?.(false);
  };

  // Ghi âm đến khi bé nói xong (hoặc bấm nút), rồi lấy file
  const outcome = await new Promise<"end" | "no-speech" | "aborted">((resolve) => {
    recorder.onstart = () => opts.onReady?.();
    recorder.start(250);
    stopCurrent = () => resolve(vad.heardSpeech ? "end" : "no-speech");
    abortCurrent = () => resolve("aborted");
    let wasSpeaking = false;
    timer = setInterval(() => {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const ev = vad.push(Math.sqrt(sum / buf.length), performance.now());
      if (vad.speaking !== wasSpeaking) {
        wasSpeaking = vad.speaking;
        opts.onVoice?.(wasSpeaking);
      }
      if (ev === "end" || ev === "no-speech") resolve(ev);
    }, 50);
  });

  const blob = await new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || mime || "audio/webm" }));
    if (recorder.state !== "inactive") recorder.stop();
    else resolve(new Blob(chunks, { type: recorder.mimeType || mime || "audio/webm" }));
  });
  release();

  if (outcome === "aborted") throw new CloudListenError("other", "aborted");
  if (outcome === "no-speech" || blob.size === 0) throw new CloudListenError("no-speech");

  opts.onThinking?.();
  const form = new FormData();
  form.append("audio", blob, "answer");
  form.append("vocab", vocabOf(opts.expected ?? []));
  let res: Response;
  try {
    res = await fetch("/api/stt", { method: "POST", body: form });
  } catch (err) {
    throw new CloudListenError("network", String(err));
  }
  if (!res.ok) throw new CloudListenError("network", `stt ${res.status}`);
  const { text } = (await res.json()) as { text?: string };
  const transcript = (text ?? "").trim();
  if (!transcript) throw new CloudListenError("no-speech");
  return { transcript, confidence: 1 };
}
