import type { Pattern, Unit } from "@content/schema";

/**
 * Mẫu câu của các Unit bé đã học (có trạm đã xong hoặc có câu đã luyện).
 * Chưa học Unit nào thì dùng Unit đầu tiên. Bài Ôn tập không tính riêng (câu của nó thuộc các Unit).
 */
export function studiedPatterns(units: Unit[], doneUnits: Set<string>, practiced: Set<string>): { patterns: Pattern[]; labels: string[] } {
  const ready = units.filter((u) => u.status === "ready" && u.kind === "unit" && u.patterns.length > 0);
  let studied = ready.filter((u) => doneUnits.has(u.id) || u.patterns.some((p) => practiced.has(p.id)));
  if (studied.length === 0) studied = ready.slice(0, 1);
  return { patterns: studied.flatMap((u) => u.patterns), labels: studied.map((u) => `Unit ${u.number}`) };
}
