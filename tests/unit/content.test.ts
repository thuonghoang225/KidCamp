import { describe, expect, it } from "vitest";
import { courses, dialogues, findPattern } from "@content/courses";
import { lexicon } from "@content/english/lexicon";
import { assetMap } from "@content/assets";
import { existsSync } from "node:fs";
import path from "node:path";

describe("nội dung", () => {
  it("mọi từ trong Unit có trong kho từ và có hình", () => {
    for (const course of courses.values()) {
      for (const unit of course.units) {
        for (const id of unit.words) {
          const w = lexicon.get(id);
          expect(w, `${unit.id}: ${id}`).toBeDefined();
          expect(assetMap.has(w!.image), `hình ${w!.image}`).toBe(true);
        }
        for (const p of unit.patterns) {
          for (const ids of Object.values(p.slots)) for (const id of ids) expect(lexicon.has(id), id).toBe(true);
        }
      }
    }
  });

  it("mọi file hình đã khai báo đều tồn tại trong public/", () => {
    for (const a of assetMap.values()) {
      expect(existsSync(path.join(__dirname, "../../public", a.file)), a.file).toBe(true);
    }
  });

  it("hội thoại chỉ dùng mẫu câu có thật", () => {
    for (const d of dialogues) {
      for (const t of d.turns) if (t.expectPattern) expect(findPattern(t.expectPattern), t.expectPattern).toBeDefined();
    }
  });

  it("Unit ready có đủ 5 trạm", () => {
    for (const course of courses.values())
      for (const unit of course.units.filter((u) => u.status === "ready")) expect(unit.stations).toHaveLength(unit.kind === "review" ? 3 : 5);
  });
});

describe("fillSlots a/an", () => {
  it("dùng 'an' trước nguyên âm", async () => {
    const { fillSlots } = await import("@content/schema");
    expect(fillSlots("Is there a {place}?", { place: "art room" })).toBe("Is there an art room?");
    expect(fillSlots("Is there a {place}?", { place: "library" })).toBe("Is there a library?");
  });
});

describe("tranh KidCamp tự vẽ", () => {
  it("mỗi asset art-* có hình vẽ và là SVG hợp lệ (không trùng thuộc tính)", async () => {
    const { ART_NAMES } = await import("@content/assets");
    const { art } = await import("../../scripts/art");
    for (const n of ART_NAMES) {
      const svg = art[n]?.();
      expect(svg, n).toMatch(/^<svg[\s\S]*<\/svg>$/);
      for (const tag of svg!.match(/<[a-z]+\s[^>]*>/g) ?? []) {
        const names = [...tag.matchAll(/\s([\w:-]+)="/g)].map((m) => m[1]);
        expect(new Set(names).size, `${n}: ${tag.slice(0, 60)}`).toBe(names.length);
      }
    }
  });

  it("từ trong kho từ đều trỏ tới hình đã khai báo", async () => {
    const { lexicon } = await import("@content/english/lexicon");
    const { assetMap } = await import("@content/assets");
    for (const w of lexicon.values()) expect(assetMap.has(w.image), `${w.id} → ${w.image}`).toBe(true);
  });
});
