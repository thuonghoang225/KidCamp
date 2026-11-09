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

export type ListenErrorCode = "not-supported" | "no-speech" | "not-allowed" | "service-off" | "no-mic" | "network" | "aborted" | "other";

export class ListenError extends Error {
  constructor(public code: ListenErrorCode, public raw?: string) {
    super(raw ? `${code} (${raw})` : code);
  }
}

/** Lỗi do máy/quyền (không phải bé nói nhỏ): hiện hướng dẫn sửa thay vì nút micro. */
export function isBlockingError(code: ListenErrorCode): boolean {
  return code === "not-supported" || code === "not-allowed" || code === "service-off" || code === "no-mic";
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
        ? "Máy đang tắt Đọc chính tả nên chưa nghe được. Vào Cài đặt → Cài đặt chung → Bàn phím → bật Đọc chính tả, rồi thử lại."
          + (app ? " Nếu vẫn không được, mở KidCamp bằng Safari thay vì biểu tượng màn hình chính." : "")
        : "Dịch vụ nhận giọng nói của trình duyệt đang bị tắt. Kiểm tra cài đặt rồi thử lại.";
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
          const map: Record<string, ListenErrorCode> = {
            "no-speech": "no-speech", "not-allowed": "not-allowed", "service-not-allowed": "service-off",
            "audio-capture": "no-mic", network: "network", aborted: "aborted",
          };
          console.warn("[KidCamp] speech recognition error:", e.error);
          reject(new ListenError(map[e.error] ?? "other", e.error));
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
