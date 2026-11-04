import { describe, expect, it } from "vitest";
import { NEW_ITEM, review, isDue } from "@/core/srs/leitner";

describe("Leitner SRS", () => {
  it("lên hộp khi đúng và hẹn ngày theo khoảng cách", () => {
    let s = review(NEW_ITEM, true, "2026-11-03");
    expect(s).toMatchObject({ box: 1, dueOn: "2026-11-04", correctCount: 1 });
    s = review(s, true, "2026-11-04");
    expect(s).toMatchObject({ box: 2, dueOn: "2026-11-06" });
    s = review(s, true, "2026-11-06");
    expect(s).toMatchObject({ box: 3, dueOn: "2026-11-10" });
  });

  it("không vượt quá hộp 5", () => {
    let s = { ...NEW_ITEM, box: 5 };
    s = review(s, true, "2026-11-03");
    expect(s).toMatchObject({ box: 5, dueOn: "2026-11-17" });
  });

  it("sai thì về hộp 1", () => {
    const s = review({ ...NEW_ITEM, box: 4 }, false, "2026-11-03");
    expect(s).toMatchObject({ box: 1, dueOn: "2026-11-04", wrongCount: 1 });
  });

  it("đến hạn khi dueOn ≤ hôm nay", () => {
    expect(isDue({ dueOn: "2026-11-03" }, "2026-11-03")).toBe(true);
    expect(isDue({ dueOn: "2026-11-04" }, "2026-11-03")).toBe(false);
    expect(isDue({ dueOn: null }, "2026-11-03")).toBe(false);
  });
});
