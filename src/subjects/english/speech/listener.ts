"use client";

import { sfx } from "@/core/sfx";
import { scoreSpeech, SPEECH_PASS } from "@/core/grading/speech";
import { speaker } from "./speaker";

/** Nghe bé nói và trả về chữ, dùng Web Speech API của trình duyệt. */
export interface Listener {
  isSupported(): boolean;
  /**
   * expected: các câu được chấp nhận (để chọn phương án nhận diện gần nhất và dừng sớm khi đã đúng).
   * onReady: gọi khi micro thật sự bắt đầu thu (iPad mất ~0,3–1 giây sau khi bấm).
   */
  listen(opts?: { expected?: string[]; timeoutMs?: number; onReady?: () => void }): Promise<{ transcript: string; confidence: number }>;
  abort(): void;
}

type RecognitionCtor = new () => SpeechRecognitionLike;
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal?: boolean }> }) => void) | null;
  onaudiostart: (() => void) | null;
  onstart: (() => void) | null;
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

export type ListenErrorCode = "not-supported" | "no-speech" | "not-allowed" | "service-off" | "no-mic" | "language" | "network" | "aborted" | "other";

let lastRaw = "";

/** Mã lỗi gốc lần gần nhất (vd. "service-not-allowed"), hiện nhỏ trên màn hình để bố mẹ gửi khi cần hỗ trợ. */
export function lastListenErrorRaw(): string {
  return lastRaw;
}

export class ListenError extends Error {
  constructor(public code: ListenErrorCode, public raw?: string) {
    super(raw ? `${code} (${raw})` : code);
    lastRaw = raw ?? code;
  }
}

/** Lỗi do máy/quyền (không phải bé nói nhỏ): hiện hướng dẫn sửa thay vì nút micro. */
export function isBlockingError(code: ListenErrorCode): boolean {
  return code === "not-supported" || code === "not-allowed" || code === "service-off" || code === "no-mic" || code === "language";
}

/** Mở từ biểu tượng màn hình chính (chế độ app, không có thanh địa chỉ). */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (navigator as { standalone?: boolean }).standalone === true || window.matchMedia?.("(display-mode: standalone)").matches;
}

function isAppleMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  // iPadOS báo mình là "Macintosh" nhưng có màn cảm ứng
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

/** Lời giải thích cho bố mẹ: vì sao máy chưa nghe được và cách sửa. */
export function listenHelp(code: ListenErrorCode): string {
  const apple = isAppleMobile();
  const app = isStandalone();
  switch (code) {
    case "not-supported":
      if (apple && app) return "Khi mở từ biểu tượng trên màn hình chính, iPad/iPhone không cho nghe giọng nói. Bố mẹ mở KidCamp bằng Safari để bé luyện nói nhé.";
      return apple
        ? "Safari trên máy này chưa nghe được giọng nói. Cập nhật iPadOS/iOS mới nhất và bật Đọc chính tả (Cài đặt → Cài đặt chung → Bàn phím)."
        : "Trình duyệt này chưa nghe được giọng nói. Hãy dùng Chrome hoặc Safari.";
    case "not-allowed":
      return apple
        ? "KidCamp chưa được dùng micro. Vào Cài đặt → Safari → Micrô (iPadOS 18 trở lên: Cài đặt → Ứng dụng → Safari → Micrô) → chọn Cho phép (hoặc bấm \"aA\" trên thanh địa chỉ → Cài đặt trang web → Micrô), rồi tải lại trang."
        : "KidCamp chưa được dùng micro. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro, rồi tải lại trang.";
    case "service-off":
      return apple
        ? "iPad chưa cho phép nhận dạng lời nói. Vào Cài đặt → Quyền riêng tư & Bảo mật → Nhận dạng lời nói → bật cho Safari. Nếu vẫn lỗi: bật Siri (Cài đặt → Siri & Tìm kiếm) và Đọc chính tả (Cài đặt → Cài đặt chung → Bàn phím), rồi đóng hẳn Safari và mở lại."
          + (app ? " Hoặc mở KidCamp bằng Safari thay vì biểu tượng màn hình chính." : "")
        : "Dịch vụ nhận giọng nói của trình duyệt đang bị tắt. Kiểm tra cài đặt rồi thử lại.";
    case "language":
      return apple
        ? "Máy chưa có Đọc chính tả tiếng Anh. Vào Cài đặt → Cài đặt chung → Bàn phím → Bàn phím → Thêm bàn phím mới → English (US), rồi thử lại."
        : "Trình duyệt chưa hỗ trợ nghe tiếng Anh (en-US) trên máy này.";
    case "no-mic":
      return "Không mở được micro. Kiểm tra micro không bị app khác (gọi video, ghi âm) đang dùng rồi thử lại.";
    default:
      return "Có lỗi khi nghe, thử lại nhé.";
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
        // Nghe liên tục và nhận kết quả tạm: chấm ngay khi bé nói xong câu,
        // không bị cắt khi bé ngập ngừng giữa câu.
        rec.interimResults = true;
        rec.continuous = true;
        rec.maxAlternatives = 5;
        const expected = opts?.expected ?? [];
        let done = false;
        let best = { transcript: "", confidence: 0, score: -1 };
        let silence: ReturnType<typeof setTimeout> | undefined;
        const limit = opts?.timeoutMs ?? 10000;

        const finish = (ok: boolean) => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          clearTimeout(hardStop);
          clearTimeout(silence);
          try { rec.stop(); } catch {}
          if (ok && best.transcript) resolve({ transcript: best.transcript, confidence: best.confidence });
          else reject(new ListenError("no-speech"));
        };
        const timer = setTimeout(() => finish(true), limit);
        // Một số trình duyệt không gọi onend sau stop(): tự kết thúc để bé không bị kẹt
        const hardStop = setTimeout(() => {
          if (done) return;
          try { rec.abort(); } catch {}
          finish(true);
        }, limit + 2000);

        let ready = false;
        const markReady = () => {
          if (ready) return;
          ready = true;
          opts?.onReady?.();
        };
        rec.onstart = () => {
          // Safari không phải lúc nào cũng có onaudiostart: dự phòng sau 300 ms
          setTimeout(markReady, 300);
        };
        rec.onaudiostart = markReady;

        rec.onresult = (e) => {
          if (done) return;
          markReady();
          // Ghép các đoạn đã nhận: đoạn cuối thử mọi phương án, đoạn trước lấy phương án đầu
          const parts = Array.from(e.results);
          const head = parts.slice(0, -1).map((r) => r[0]?.transcript ?? "").join(" ");
          const last = Array.from(parts.at(-1) ?? []);
          for (const alt of last) {
            const transcript = `${head} ${alt.transcript}`.trim();
            const score = expected.length ? scoreSpeech(transcript, expected).score : 1;
            if (score > best.score) best = { transcript, confidence: alt.confidence ?? 0, score };
          }
          // Đã nói đúng: dừng ngay, không bắt bé chờ
          if (expected.length && best.score >= SPEECH_PASS) return finish(true);
          // Chưa đúng: đợi bé nói tiếp, im lặng 1,5 giây thì chấm với câu đã nghe được
          clearTimeout(silence);
          silence = setTimeout(() => finish(true), 1500);
        };
        rec.onerror = (e) => {
          if (done) return;
          if (e.error === "no-speech" || e.error === "aborted") return finish(true);
          done = true;
          clearTimeout(timer);
          clearTimeout(hardStop);
          clearTimeout(silence);
          const map: Record<string, ListenErrorCode> = {
            "no-speech": "no-speech", "not-allowed": "not-allowed", "service-not-allowed": "service-off",
            "audio-capture": "no-mic", "language-not-supported": "language", network: "network", aborted: "aborted",
          };
          console.warn("[KidCamp] speech recognition error:", e.error);
          reject(new ListenError(map[e.error] ?? "other", e.error));
        };
        rec.onend = () => {
          current = null;
          finish(true);
        };
        // iPad/Safari: đang phát âm thanh (file mp3, giọng trình duyệt, hiệu ứng) thì nhận giọng nói
        // dễ bị từ chối với lỗi service-not-allowed. Dừng hết trước khi mở micro (vẫn trong cú bấm của bé).
        speaker.stop();
        sfx.release();
        try {
          rec.start();
        } catch (err) {
          // Safari ném lỗi ngay khi bị chặn (vd. chế độ app màn hình chính)
          done = true;
          clearTimeout(timer);
          clearTimeout(hardStop);
          console.warn("[KidCamp] speech recognition start failed:", err);
          const name = err instanceof Error ? err.name : "";
          reject(new ListenError(name === "NotAllowedError" ? "not-allowed" : "service-off", String(err)));
        }
      });
    },
    abort() {
      current?.abort();
    },
  };
}

export const listener = createListener();
