import { addDays, weekStart, type Day } from "../date";

/** Sao theo tỉ lệ trả lời đúng ngay lần đầu. Hoàn thành luôn được ít nhất 1 sao. */
export function starsFor(firstTryCorrect: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 1;
  const ratio = firstTryCorrect / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return 1;
}

/**
 * Chuỗi ngày học liên tiếp tính đến hôm nay (hoặc hôm qua nếu hôm nay chưa học).
 * Mỗi tuần (Thứ Hai–Chủ nhật) được nghỉ 1 ngày mà không mất chuỗi.
 */
export function computeStreak(activeDays: Iterable<Day>, today: Day): number {
  const days = new Set(activeDays);
  let cursor = days.has(today) ? today : addDays(today, -1);
  if (!days.has(cursor)) {
    // Hôm qua cũng không học: vẫn giữ chuỗi nếu đó là ngày nghỉ được phép
    const before = addDays(cursor, -1);
    if (!days.has(before)) return 0;
    cursor = before;
    const usedFreeze = new Set<Day>([weekStart(addDays(today, -1))]);
    return count(days, cursor, usedFreeze);
  }
  return count(days, cursor, new Set());
}

function count(days: Set<Day>, start: Day, usedFreeze: Set<Day>): number {
  let streak = 0;
  let cursor = start;
  for (;;) {
    if (days.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    const week = weekStart(cursor);
    const prev = addDays(cursor, -1);
    if (!usedFreeze.has(week) && days.has(prev)) {
      usedFreeze.add(week);
      cursor = prev;
      continue;
    }
    return streak;
  }
}
