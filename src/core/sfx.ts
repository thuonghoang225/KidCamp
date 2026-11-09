/**
 * Hiệu ứng âm thanh khi trả lời đúng / sai, tổng hợp bằng Web Audio
 * (không dùng file âm thanh nên không lo bản quyền, không tốn dung lượng).
 * Tắt/bật được, lựa chọn lưu trong localStorage `kc_sfx`.
 */

type Note = { freq: number; at: number; dur: number; type?: OscillatorType; gain?: number; slideTo?: number };

const KEY = "kc_sfx";
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let muted: boolean | null = null;

function readMuted(): boolean {
  if (muted !== null) return muted;
  try {
    muted = localStorage.getItem(KEY) === "off";
  } catch {
    muted = false;
  }
  return muted;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  // iPad/Safari: context bị treo cho tới khi có thao tác của người dùng
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function playNotes(notes: Note[], volume = 0.25) {
  if (readMuted()) return;
  const ac = audio();
  if (!ac) return;
  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);
  const t0 = ac.currentTime + 0.02;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? "sine";
    const start = t0 + n.at;
    const end = start + n.dur;
    osc.frequency.setValueAtTime(n.freq, start);
    if (n.slideTo) osc.frequency.exponentialRampToValueAtTime(n.slideTo, end);
    // Bao âm mềm: lên nhanh, tắt dần, tránh tiếng "tách"
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(n.gain ?? 1, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(g).connect(master);
    osc.start(start);
    osc.stop(end + 0.02);
  }
}

// Tần số nốt (Hz)
const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, E6 = 1318.5, G6 = 1568;

export const sfx = {
  /** Nhả loa trước khi mở micro: trên iPad, AudioContext đang chạy có thể làm nhận giọng nói báo lỗi. */
  release() {
    if (ctx && ctx.state === "running") void ctx.suspend().catch(() => {});
  },
  /** "Ting-ting!" đi lên, vui tai. */
  correct() {
    playNotes([
      { freq: E5, at: 0, dur: 0.18, type: "triangle" },
      { freq: C6, at: 0.09, dur: 0.35, type: "triangle" },
      { freq: C6 * 2, at: 0.09, dur: 0.25, gain: 0.15 },
    ]);
  },
  /** Hai tiếng trầm nhẹ đi xuống: báo sai nhưng không làm bé sợ. */
  wrong() {
    playNotes(
      [
        { freq: 330, at: 0, dur: 0.16, type: "triangle", slideTo: 300 },
        { freq: 247, at: 0.17, dur: 0.3, type: "triangle", slideTo: 220 },
      ],
      0.22,
    );
  },
  /** Nhạc hiệu ngắn khi xong bài. */
  finish() {
    playNotes([
      { freq: C5, at: 0, dur: 0.15, type: "triangle" },
      { freq: E5, at: 0.12, dur: 0.15, type: "triangle" },
      { freq: G5, at: 0.24, dur: 0.15, type: "triangle" },
      { freq: C6, at: 0.36, dur: 0.5, type: "triangle" },
      { freq: E6, at: 0.36, dur: 0.5, gain: 0.3 },
      { freq: G6, at: 0.36, dur: 0.5, gain: 0.2 },
    ]);
  },
  isMuted: readMuted,
  setMuted(value: boolean) {
    muted = value;
    try {
      localStorage.setItem(KEY, value ? "off" : "on");
    } catch {
      /* chế độ riêng tư: chỉ nhớ trong phiên */
    }
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/** Chờ hiệu ứng kêu xong rồi mới đọc đáp án, để hai âm không đè nhau. */
export const SFX_GAP_MS = 450;
