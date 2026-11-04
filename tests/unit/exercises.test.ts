import { describe, expect, it } from "vitest";
import { getCourse, getUnit } from "@content/courses";
import { buildStationSession, dueItems, nextStation } from "@/core/session/build";
import { grade } from "@/core/exercises/grade";
import type { Exercise } from "@/core/exercises/types";

const unit = getUnit("en-g4", "u01")!;

function correctResponse(ex: Exercise) {
  switch (ex.kind) {
    case "listen-pick-image":
    case "image-pick-word":
    case "pick-answer":
    case "pick-sound":
      return { type: "choice" as const, choiceId: ex.answerId };
    case "spell-word":
    case "order-words":
      return { type: "text" as const, text: ex.answer };
    case "say-word":
      return { type: "speech" as const, transcript: ex.text };
    case "say-sentence":
      return { type: "speech" as const, transcript: ex.model };
    case "chant":
      return { type: "done" as const };
  }
}

const readyUnits = getCourse("en-g4")!.units.filter((u) => u.status === "ready");

describe("trạm của mọi Unit đã soạn", () => {
  for (const u of readyUnits) {
    for (const st of u.stations) {
      it(`${u.id}/${st.id}: có bài và chấm đúng đáp án đúng (nhiều seed)`, () => {
        for (const seed of ["a", "b", "c", "d"]) {
          const exs = buildStationSession(u, st.id, seed);
          expect(exs.length).toBeGreaterThan(0);
          for (const ex of exs) expect(grade(ex, correctResponse(ex)).correct, `${ex.kind} ${JSON.stringify(ex).slice(0, 120)}`).toBe(true);
        }
      });
    }
  }

  it("câu hỏi có chỗ trống được điền đủ (không còn {…})", () => {
    for (const u of readyUnits)
      for (const st of u.stations)
        for (const ex of buildStationSession(u, st.id, "q"))
          if ("question" in ex) expect(ex.question, ex.question).not.toMatch(/\{\w+\}/);
  });

  it("cùng seed thì cùng thứ tự bài", () => {
    const a = buildStationSession(unit, "words", "x").map((e) => e.itemId);
    const b = buildStationSession(unit, "words", "x").map((e) => e.itemId);
    expect(a).toEqual(b);
  });

  it("trắc nghiệm có 4 phương án không trùng", () => {
    const ex = buildStationSession(unit, "words", "y").find((e) => e.kind === "listen-pick-image")!;
    if (ex.kind !== "listen-pick-image") throw new Error();
    expect(new Set(ex.options.map((o) => o.id)).size).toBe(4);
  });

  it("chọn sai thì chấm sai", () => {
    const ex = buildStationSession(unit, "words", "z").find((e) => e.kind === "listen-pick-image")!;
    if (ex.kind !== "listen-pick-image") throw new Error();
    const wrong = ex.options.find((o) => o.id !== ex.answerId)!;
    expect(grade(ex, { type: "choice", choiceId: wrong.id }).correct).toBe(false);
  });
});

describe("lịch ôn", () => {
  it("lấy tối đa 8 item đến hạn, hộp thấp trước", () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({
      itemId: `w.${i}`, box: (i % 5) + 1, dueOn: "2026-11-01", correctCount: 0, wrongCount: 0,
    }));
    rows.push({ itemId: "w.future", box: 1, dueOn: "2026-12-01", correctCount: 0, wrongCount: 0 });
    const due = dueItems(rows, "2026-11-03");
    expect(due).toHaveLength(8);
    expect(due[0].box).toBe(1);
    expect(due.find((d) => d.itemId === "w.future")).toBeUndefined();
  });

  it("trạm tiếp theo là trạm đầu chưa xong", () => {
    expect(nextStation([unit], new Set())?.stationId).toBe("words");
    expect(nextStation([unit], new Set(["u01/words", "u01/patterns"]))?.stationId).toBe("chant");
  });
});

describe("phương án nhiễu", () => {
  it("không có phương án sai nào mở đầu giống đáp án đúng", () => {
    for (const u of readyUnits)
      for (const seed of ["x", "y", "z"])
        for (const ex of buildStationSession(u, "patterns", seed)) {
          if (ex.kind !== "pick-answer") continue;
          const open2 = (t: string) => t.toLowerCase().replace(/[^a-z' ]/g, "").split(" ").slice(0, 2).join(" ");
          const right = ex.options.find((o) => o.id === ex.answerId)!.label;
          expect(ex.options).toHaveLength(3);
          for (const o of ex.options.filter((o) => o.id !== ex.answerId)) expect(open2(o.label), `${right} / ${o.label}`).not.toBe(open2(right));
        }
  });
});
