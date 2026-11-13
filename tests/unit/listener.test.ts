import { afterEach, describe, expect, it, vi } from "vitest";

type Alt = { transcript: string; confidence: number };
class FakeRec {
  static last: FakeRec;
  lang = ""; interimResults = false; continuous = false; maxAlternatives = 1;
  onresult: ((e: { results: Alt[][] }) => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  onaudiostart: (() => void) | null = null;
  stopped = false;
  constructor() { FakeRec.last = this; }
  start() { this.onstart?.(); }
  stop() { this.stopped = true; }
  abort() { this.stopped = true; }
}

async function setup() {
  vi.useFakeTimers();
  vi.stubGlobal("window", { webkitSpeechRecognition: FakeRec, matchMedia: () => ({ matches: false }) });
  const { createListener } = await import("@/subjects/english/speech/listener");
  return createListener();
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("listener", () => {
  it("báo micro sẵn sàng và dừng ngay khi bé nói đúng", async () => {
    const l = await setup();
    const onReady = vi.fn();
    const p = l.listen({ expected: ["I live in a flat."], onReady });
    FakeRec.last.onaudiostart?.();
    expect(onReady).toHaveBeenCalledOnce();
    FakeRec.last.onresult?.({ results: [[{ transcript: "I live", confidence: 0.5 }]] });
    expect(FakeRec.last.stopped).toBe(false);
    FakeRec.last.onresult?.({ results: [[{ transcript: "I live in a flat", confidence: 0.9 }]] });
    await expect(p).resolves.toMatchObject({ transcript: "I live in a flat" });
    expect(FakeRec.last.stopped).toBe(true);
  });

  it("không dừng khi mới nói được phần đầu câu (giữ từ cuối)", async () => {
    const l = await setup();
    const p = l.listen({ expected: ["I live in a big flat."] });
    // "i live in a big" = 5/6 từ, đã qua ngưỡng chấm nhưng chưa đủ câu
    FakeRec.last.onresult?.({ results: [[{ transcript: "I live in a big", confidence: 0.8 }]] });
    expect(FakeRec.last.stopped).toBe(false);
    FakeRec.last.onresult?.({ results: [[{ transcript: "I live in a big flat", confidence: 0.9 }]] });
    await expect(p).resolves.toMatchObject({ transcript: "I live in a big flat" });
  });

  it("không ghép trùng khi Safari trả cả câu dồn lại", async () => {
    const l = await setup();
    const p = l.listen({ expected: ["I'm from Japan."] });
    FakeRec.last.onresult?.({ results: [[{ transcript: "I'm from", confidence: 0.8 }], [{ transcript: "I'm from Japan", confidence: 0.9 }]] });
    await expect(p).resolves.toMatchObject({ transcript: "I'm from Japan" });
  });

  it("chọn phương án nhận diện gần câu mẫu nhất", async () => {
    const l = await setup();
    const p = l.listen({ expected: ["flat"] });
    FakeRec.last.onresult?.({ results: [[{ transcript: "flag", confidence: 0.9 }, { transcript: "flat", confidence: 0.4 }]] });
    await expect(p).resolves.toMatchObject({ transcript: "flat" });
  });

  it("chưa đúng thì chờ 2 giây im lặng rồi trả câu đã nghe", async () => {
    const l = await setup();
    const p = l.listen({ expected: ["Where are you from?"] });
    FakeRec.last.onresult?.({ results: [[{ transcript: "where you", confidence: 0.5 }]] });
    vi.advanceTimersByTime(2100);
    await expect(p).resolves.toMatchObject({ transcript: "where you" });
  });

  it("báo bé đang nói rồi tắt sóng khi im lặng", async () => {
    const l = await setup();
    const onVoice = vi.fn();
    const p = l.listen({ expected: ["Where are you from?"], onVoice });
    (FakeRec.last as unknown as { onspeechstart?: () => void }).onspeechstart?.();
    expect(onVoice).toHaveBeenLastCalledWith(true);
    vi.advanceTimersByTime(900);
    expect(onVoice).toHaveBeenLastCalledWith(false);
    FakeRec.last.onresult?.({ results: [[{ transcript: "where are you from", confidence: 0.9 }]] });
    await expect(p).resolves.toMatchObject({ transcript: "where are you from" });
  });

  it("không nghe thấy gì thì báo no-speech", async () => {
    const l = await setup();
    const p = l.listen({ expected: ["hello"] });
    FakeRec.last.onend?.();
    await expect(p).rejects.toMatchObject({ code: "no-speech" });
  });
});
