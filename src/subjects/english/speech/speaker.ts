"use client";

import { audioKey, VOICES, type Voice, type VoicePreference } from "./audio-key";

/**
 * Đọc tiếng Anh cho bé nghe.
 * - Ưu tiên file MP3 tạo sẵn bằng giọng AI (public/audio/<giọng>/<khóa>.mp3).
 * - Câu chưa có file thì dùng giọng có sẵn của trình duyệt (Anh–Mỹ).
 * - Phụ huynh chọn một giọng cố định, hoặc để luân phiên (heart, bella, michael).
 * - Tốc độ "Bình thường" / "Chậm" do bé chọn trên màn học, nhớ theo thiết bị.
 */
export type SpeechRate = "normal" | "slow";

export interface Speaker {
  /** `fallback`: câu đọc bằng giọng trình duyệt khi chưa có file (vd. âm /ɪə/ → đọc từ mẫu "here"). */
  play(text: string, opts?: { rate?: number; voice?: Voice; fallback?: string }): Promise<void>;
  stop(): void;
  /** Chuyển sang giọng kế tiếp (chỉ khi đang luân phiên). */
  nextVoice(): Voice;
  readonly voice: Voice;
  /** Giọng phụ huynh đã chọn cho bé. */
  setPreference(pref: VoicePreference): void;
  readonly preference: VoicePreference;
  getRate(): SpeechRate;
  setRate(rate: SpeechRate): void;
  subscribe(listener: () => void): () => void;
}

/** Tốc độ phát khi chọn "Chậm" (giữ nguyên cao độ giọng). */
export const SLOW_FACTOR = 0.75;

type Manifest = { voices: Voice[]; keys: Set<string> };
let manifest: Promise<Manifest | null> | null = null;

function loadManifest(): Promise<Manifest | null> {
  manifest ??= fetch("/audio/manifest.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((m: { voices: Voice[]; keys: string[] } | null) => (m ? { voices: m.voices, keys: new Set(m.keys) } : null))
    .catch(() => null);
  return manifest;
}

/* ---------- Giọng trình duyệt (dự phòng) ---------- */

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickSystemVoice(lang: string): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  // Giọng chất lượng cao của Apple/Google/Microsoft trước, giọng cũ (Samantha) sau cùng
  const prefer = ["Ava (Premium)", "Zoe (Premium)", "Evan (Enhanced)", "Ava", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Allison", "Samantha"];
  const same = voices.filter((v) => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase());
  cachedVoice =
    prefer.map((n) => same.find((v) => v.name.includes(n))).find(Boolean) ??
    same.find((v) => v.localService) ??
    same[0] ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null;
  return cachedVoice;
}

function speakWithBrowser(text: string, lang: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) return resolve();
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.05;
    const v = pickSystemVoice(lang);
    if (v) u.voice = v;
    // Safari đôi khi không gọi onend: tự kết thúc sau thời lượng ước tính
    const guard = setTimeout(resolve, 1500 + (text.length * 110) / (u.rate || 1));
    u.onend = () => { clearTimeout(guard); resolve(); };
    u.onerror = () => { clearTimeout(guard); resolve(); };
    synth.speak(u);
  });
}

/* ---------- Speaker ---------- */

const ROTATION_KEY = "kc_voice_index";
const RATE_KEY = "kc_rate";

function readRate(): SpeechRate {
  try {
    return localStorage.getItem(RATE_KEY) === "slow" ? "slow" : "normal";
  } catch {
    return "normal";
  }
}

function readIndex(): number {
  try {
    return Number(localStorage.getItem(ROTATION_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function createSpeaker(lang = "en-US"): Speaker {
  let index = typeof window === "undefined" ? 0 : readIndex();
  let preference: VoicePreference = "rotate";
  let rate: SpeechRate | null = null;
  const listeners = new Set<() => void>();
  let audio: HTMLAudioElement | null = null;
  let finish: (() => void) | null = null;

  const current = (): Voice => (preference === "rotate" ? VOICES[index % VOICES.length] : preference);
  const getRate = (): SpeechRate => (rate ??= typeof window === "undefined" ? "normal" : readRate());

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
    }
    finish?.();
    finish = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  return {
    get voice() {
      return current();
    },
    get preference() {
      return preference;
    },
    setPreference(pref) {
      preference = pref;
    },
    getRate,
    setRate(next) {
      rate = next;
      try {
        localStorage.setItem(RATE_KEY, next);
      } catch {
        /* chỉ nhớ trong phiên */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    nextVoice() {
      if (preference !== "rotate") return preference;
      index = (index + 1) % VOICES.length;
      try {
        localStorage.setItem(ROTATION_KEY, String(index));
      } catch {
        /* trình duyệt chặn lưu trữ: vẫn luân phiên trong phiên này */
      }
      return VOICES[index];
    },
    async play(text, opts) {
      if (typeof window === "undefined") return;
      stop();
      const voice = opts?.voice ?? current();
      const slow = getRate() === "slow";
      const m = await loadManifest();
      const key = audioKey(text);
      // Giọng đã chọn chưa có file (VD: chưa tạo giọng Azure): dùng giọng Kokoro mặc định
      const kokoro = m?.voices.includes(voice) ? voice : (m?.voices.find((v) => VOICES.includes(v)) ?? VOICES[0]);
      // Câu có `fallback` (âm đứng riêng) vẫn thử phát file dù manifest chưa có khóa: manifest trình duyệt
      // giữ trong bộ nhớ đệm có thể là bản cũ, và đọc thay bằng từ mẫu dễ làm bé hiểu nhầm.
      const usable = m?.keys.has(key) ? kokoro : opts?.fallback ? kokoro : undefined;
      if (usable) {
        audio ??= new Audio();
        const el = audio;
        el.preservesPitch = true;
        const ok = await new Promise<boolean>((resolve) => {
          finish = () => resolve(true);
          el.onended = () => resolve(true);
          el.onerror = () => resolve(false);
          el.src = `/audio/${usable}/${key}.mp3`;
          // playbackRate phải đặt sau khi đổi src (Safari đặt lại khi nạp file mới)
          el.defaultPlaybackRate = el.playbackRate = slow ? SLOW_FACTOR : 1;
          el.play().catch(() => resolve(false));
        });
        finish = null;
        if (ok) return;
      }
      // Chưa có file (hoặc trình duyệt chặn phát): dùng giọng trình duyệt
      await speakWithBrowser(opts?.fallback ?? text, lang, (opts?.rate ?? 0.95) * (slow ? SLOW_FACTOR : 1));
    },
    stop,
  };
}

export const speaker = createSpeaker();
