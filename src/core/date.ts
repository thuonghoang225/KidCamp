/** Ngày dạng YYYY-MM-DD theo múi giờ của gia đình (mặc định Việt Nam). */
export type Day = string;

export const DEFAULT_TZ = "Asia/Ho_Chi_Minh";

export function toDay(date: Date, timeZone: string = DEFAULT_TZ): Day {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function addDays(day: Day, n: number): Day {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function diffDays(a: Day, b: Day): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86_400_000);
}

/** Thứ Hai đầu tuần (ISO) của một ngày. */
export function weekStart(day: Day): Day {
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay(); // 0 = CN
  return addDays(day, -((dow + 6) % 7));
}
