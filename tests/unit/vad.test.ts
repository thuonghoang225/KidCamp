import { describe, expect, it } from "vitest";
import { Vad } from "@/subjects/english/speech/vad";

/** Chạy chuỗi âm lượng, mỗi bước 50 ms; trả về sự kiện cuối và thời điểm. */
function run(vad: Vad, segments: Array<[level: number, ms: number]>) {
  let t = 0;
  let last = "waiting";
  for (const [level, ms] of segments) {
    for (let x = 0; x < ms; x += 50) {
      last = vad.push(level, t);
      if (last === "end" || last === "no-speech") return { last, t };
      t += 50;
    }
  }
  return { last, t };
}

describe("Vad", () => {
  it("không nghe thấy gì thì báo no-speech", () => {
    expect(run(new Vad({ noSpeechMs: 2000 }), [[0.002, 3000]]).last).toBe("no-speech");
  });

  it("bé ngừng giữa câu ngắn (1,5 giây) vẫn chưa kết thúc", () => {
    const r = run(new Vad(), [[0.002, 400], [0.1, 600], [0.002, 1500], [0.1, 800], [0.002, 400]]);
    expect(r.last).not.toBe("end");
  });

  it("nói xong câu dài, im lặng đủ lâu thì kết thúc", () => {
    const r = run(new Vad(), [[0.002, 400], [0.1, 2000], [0.002, 3000]]);
    expect(r.last).toBe("end");
    // kết thúc sau ~1,3 giây im lặng (câu dài), không phải chờ hết 3 giây
    expect(r.t).toBeLessThan(400 + 2000 + 1600);
  });

  it("tiếng ồn nền cao (quạt) không bị tính là đang nói", () => {
    expect(run(new Vad({ noSpeechMs: 2000 }), [[0.03, 3000]]).last).toBe("no-speech");
  });
});
