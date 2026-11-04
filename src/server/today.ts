import "server-only";
import { toDay } from "@/core/date";

export function today(timezone: string): string {
  return toDay(new Date(), timezone);
}
