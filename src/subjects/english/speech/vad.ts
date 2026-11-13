/**
 * Phát hiện bé bắt đầu / ngừng nói từ âm lượng micro (không cần mô hình AI).
 * Ngưỡng tự điều chỉnh theo tiếng ồn phòng trong 0,3 giây đầu.
 * Trẻ nói chậm, hay ngừng giữa câu: câu còn ngắn thì chờ lâu hơn trước khi coi là nói xong.
 */
export type VadEvent = "waiting" | "speech-start" | "speaking" | "pause" | "end" | "no-speech";

export type VadOptions = {
  /** Thời gian đo tiếng ồn nền (ms). */
  calibrateMs?: number;
  /** Phải to hơn ngưỡng liên tục bao lâu mới tính là bắt đầu nói (ms). */
  minSpeechMs?: number;
  /** Im lặng bao lâu thì coi là nói xong, khi bé đã nói được một đoạn dài (ms). */
  endSilenceMs?: number;
  /** Như trên nhưng khi bé mới nói một đoạn ngắn (ms): chờ lâu hơn để bé nói tiếp. */
  shortEndSilenceMs?: number;
  /** Đoạn nói dưới chừng này (ms) được coi là "ngắn". */
  shortSpeechMs?: number;
  /** Không nghe thấy gì trong chừng này (ms) thì dừng. */
  noSpeechMs?: number;
  /** Tối đa một lượt nói (ms). */
  maxMs?: number;
};

export class Vad {
  private o: Required<VadOptions>;
  private t0: number | null = null;
  private noise = 0;
  private noiseN = 0;
  private aboveSince: number | null = null;
  private speechAt: number | null = null;
  private lastVoice = 0;
  private voicedMs = 0;
  private lastT = 0;
  speaking = false;

  constructor(opts: VadOptions = {}) {
    this.o = {
      calibrateMs: 300,
      minSpeechMs: 120,
      endSilenceMs: 1300,
      shortEndSilenceMs: 2200,
      shortSpeechMs: 1200,
      noSpeechMs: 7000,
      maxMs: 15000,
      ...opts,
    };
  }

  /** Ngưỡng hiện tại: gấp ~3 lần tiếng ồn nền, không thấp hơn mức tối thiểu. */
  get threshold(): number {
    return Math.max(this.noise * 3, 0.012);
  }

  /** Đưa vào âm lượng RMS (0..1) tại thời điểm t (ms); trả về trạng thái. */
  push(level: number, t: number): VadEvent {
    if (this.t0 === null) this.t0 = t;
    const dt = this.lastT ? t - this.lastT : 0;
    this.lastT = t;
    const elapsed = t - this.t0;

    if (elapsed < this.o.calibrateMs) {
      this.noise = (this.noise * this.noiseN + level) / (this.noiseN + 1);
      this.noiseN++;
      return "waiting";
    }
    if (elapsed > this.o.maxMs) return this.speechAt === null ? "no-speech" : "end";

    const loud = level > this.threshold;
    if (this.speechAt === null) {
      if (loud) {
        this.aboveSince ??= t;
        if (t - this.aboveSince >= this.o.minSpeechMs) {
          this.speechAt = this.aboveSince;
          this.lastVoice = t;
          this.speaking = true;
          return "speech-start";
        }
      } else {
        this.aboveSince = null;
        // Tiếng ồn nền thay đổi chậm (quạt, điều hòa): cập nhật dần khi chưa nói
        this.noise = this.noise * 0.98 + level * 0.02;
      }
      return elapsed > this.o.noSpeechMs ? "no-speech" : "waiting";
    }

    // Đang trong lượt nói: dùng ngưỡng thấp hơn một chút để không cắt cuối từ nhỏ dần
    if (level > this.threshold * 0.7) {
      this.lastVoice = t;
      this.voicedMs += dt;
      this.speaking = true;
      return "speaking";
    }
    this.speaking = false;
    const wait = this.voicedMs < this.o.shortSpeechMs ? this.o.shortEndSilenceMs : this.o.endSilenceMs;
    return t - this.lastVoice >= wait ? "end" : "pause";
  }

  /** Đã nghe thấy bé nói chưa. */
  get heardSpeech(): boolean {
    return this.speechAt !== null;
  }
}
