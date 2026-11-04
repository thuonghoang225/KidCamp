import { describe, expect, it } from "vitest";
import { computeStreak, starsFor } from "@/core/rewards";

describe("starsFor", () => {
  it("3 sao từ 90%, 2 sao từ 70%, còn lại 1 sao", () => {
    expect(starsFor(9, 10)).toBe(3);
    expect(starsFor(7, 10)).toBe(2);
    expect(starsFor(2, 10)).toBe(1);
    expect(starsFor(0, 0)).toBe(1);
  });
});

describe("computeStreak", () => {
  // 2026-11-03 là Thứ Ba
  it("đếm các ngày liên tiếp tới hôm nay", () => {
    expect(computeStreak(["2026-11-01", "2026-11-02", "2026-11-03"], "2026-11-03")).toBe(3);
  });
  it("hôm nay chưa học thì tính tới hôm qua", () => {
    expect(computeStreak(["2026-11-01", "2026-11-02"], "2026-11-03")).toBe(2);
  });
  it("cho nghỉ 1 ngày mỗi tuần", () => {
    // 28/10 (T4), nghỉ 29/10 (T5), học 30/10 → 03/11
    const days = ["2026-10-28", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02", "2026-11-03"];
    expect(computeStreak(days, "2026-11-03")).toBe(6);
  });
  it("nghỉ 2 ngày liền thì mất chuỗi", () => {
    expect(computeStreak(["2026-10-30", "2026-11-02", "2026-11-03"], "2026-11-03")).toBe(2);
  });
  it("chưa học ngày nào thì bằng 0", () => {
    expect(computeStreak([], "2026-11-03")).toBe(0);
  });
});
