/**
 * Nhịp nền cho phần chant (kiểu "jazz chant"): trống, vỗ tay, hi-hat tổng hợp bằng Web Audio,
 * không dùng file âm thanh. Bé đọc theo nhịp thay vì phải hát giai điệu.
 */

export type Beat = {
  /** Thời điểm (giây, theo đồng hồ AudioContext) bắt đầu ô nhịp kế tiếp sau `from`. */
  nextBar(from?: number): number;
  /** Độ dài một ô nhịp 4 phách (giây). */
  readonly bar: number;
  readonly ctx: AudioContext;
  /** Giảm âm lượng nhịp khi có giọng đọc, để nghe rõ lời. */
  duck(on: boolean): void;
  stop(): void;
};

export function startBeat(bpm = 96, opts: { countIn?: boolean } = {}): Beat | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  void ctx.resume();
  const master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);

  const beatLen = 60 / bpm;
  const bar = beatLen * 4;
  const t0 = ctx.currentTime + 0.15;

  // Tiếng ồn trắng dùng chung cho vỗ tay và hi-hat
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const kick = (t: number) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.3);
  };
  const hiss = (t: number, dur: number, freq: number, level: number) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  };
  const clap = (t: number) => {
    // Ba tiếng sát nhau nghe giống vỗ tay
    hiss(t, 0.05, 1200, 0.5);
    hiss(t + 0.012, 0.05, 1200, 0.45);
    hiss(t + 0.024, 0.14, 1000, 0.4);
  };
  const tick = (t: number, accent: boolean) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = accent ? 1760 : 1320;
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.1);
  };

  // Đếm nhập 4 phách (tick) rồi vào nhịp trống
  const start = opts.countIn === false ? t0 : t0 + bar;
  if (opts.countIn !== false) for (let i = 0; i < 4; i++) tick(t0 + i * beatLen, i === 0);

  // Lên lịch trước từng đoạn ngắn để không tốn máy và dừng được ngay
  let scheduledUntil = start;
  let stopped = false;
  const schedule = () => {
    if (stopped) return;
    const horizon = ctx.currentTime + 1.5;
    while (scheduledUntil < horizon) {
      const t = scheduledUntil;
      const beatIndex = Math.round((t - start) / (beatLen / 2));
      const onBeat = beatIndex % 2 === 0;
      const beat = Math.floor(beatIndex / 2) % 4;
      if (onBeat && (beat === 0 || beat === 2)) kick(t);
      if (onBeat && (beat === 1 || beat === 3)) clap(t);
      hiss(t, 0.035, 7000, onBeat ? 0.18 : 0.1);
      scheduledUntil += beatLen / 2;
    }
  };
  schedule();
  const timer = setInterval(schedule, 250);

  return {
    bar,
    ctx,
    nextBar(from = ctx.currentTime) {
      if (from <= start) return start;
      return start + Math.ceil((from - start) / bar - 1e-6) * bar;
    },
    duck(on) {
      master.gain.setTargetAtTime(on ? 0.28 : 0.55, ctx.currentTime, 0.05);
    },
    stop() {
      stopped = true;
      clearInterval(timer);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      setTimeout(() => void ctx.close().catch(() => {}), 300);
    },
  };
}
