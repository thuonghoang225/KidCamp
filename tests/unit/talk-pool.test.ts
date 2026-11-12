import { describe, expect, it } from "vitest";
import { enG4 } from "@content/en-g4";
import { studiedPatterns } from "@/core/session/talk-pool";

describe("Hỏi nhanh chỉ hỏi Unit đã học", () => {
  it("chưa học gì thì chỉ dùng Unit 1", () => {
    const pool = studiedPatterns(enG4.units, new Set(), new Set());
    expect(pool.labels).toEqual(["Unit 1"]);
    expect(pool.patterns.every((p) => enG4.units[0].patterns.includes(p))).toBe(true);
  });

  it("lấy Unit có trạm đã xong hoặc câu đã luyện, bỏ Unit chưa học và bài Ôn tập", () => {
    const pool = studiedPatterns(enG4.units, new Set(["u02", "r1"]), new Set(["s.where-were-you-last-summer"]));
    expect(pool.labels).toEqual(["Unit 2", "Unit 10"]);
    expect(pool.patterns.some((p) => p.id === "s.whats-the-weather-like")).toBe(false);
  });
});
