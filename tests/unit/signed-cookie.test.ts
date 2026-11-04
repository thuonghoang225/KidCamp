import { describe, expect, it } from "vitest";
import { sign, verify } from "@/server/auth/signed-cookie";

const SECRET = "test-secret-1234567890";

describe("cookie mở khóa phụ huynh", () => {
  it("hợp lệ trong thời hạn", () => {
    const v = sign("parent-1", 60_000, SECRET, 1_000);
    expect(verify(v, "parent-1", SECRET, 30_000)).toBe(true);
  });
  it("hết hạn thì không hợp lệ", () => {
    const v = sign("parent-1", 60_000, SECRET, 1_000);
    expect(verify(v, "parent-1", SECRET, 70_000)).toBe(false);
  });
  it("không dùng được cho phụ huynh khác hoặc khi bị sửa", () => {
    const v = sign("parent-1", 60_000, SECRET, 1_000);
    expect(verify(v, "parent-2", SECRET, 2_000)).toBe(false);
    expect(verify(v.replace(/\.(\d+)\./, ".99999999999."), "parent-1", SECRET, 2_000)).toBe(false);
    expect(verify(v, "parent-1", "other-secret-0000000", 2_000)).toBe(false);
  });
});
