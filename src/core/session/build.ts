import type { StationId, Unit } from "@content/schema";
import { buildStation, reviewExercise } from "../exercises/generate";
import type { Exercise } from "../exercises/types";
import { createRng, seedFrom } from "../random";
import { isDue, type ItemState } from "../srs/leitner";
import type { Day } from "../date";

export const MAX_REVIEW = 8;

export type ProgressRow = ItemState & { itemId: string };

/** Item đến hạn ôn, ưu tiên hộp thấp (khó nhớ hơn) và đến hạn sớm hơn. */
export function dueItems(progress: ProgressRow[], today: Day, limit = MAX_REVIEW): ProgressRow[] {
  return progress
    .filter((p) => isDue(p, today))
    .sort((a, b) => a.box - b.box || (a.dueOn ?? "").localeCompare(b.dueOn ?? ""))
    .slice(0, limit);
}

export function buildReviewSession(progress: ProgressRow[], unitOf: (itemId: string) => Unit | undefined, today: Day, seed: string): Exercise[] {
  const rng = createRng(seedFrom(`${seed}:${today}:review`));
  return dueItems(progress, today).flatMap((p) => {
    const unit = unitOf(p.itemId);
    const ex = unit ? reviewExercise(p.itemId, unit, rng) : null;
    return ex ? [ex] : [];
  });
}

export function buildStationSession(unit: Unit, stationId: StationId, seed: string): Exercise[] {
  return buildStation(unit, stationId, createRng(seedFrom(`${seed}:${unit.id}:${stationId}`)));
}

/** Trạm tiếp theo bé nên học: trạm đầu tiên chưa hoàn thành của Unit đầu tiên còn dở. */
export function nextStation(units: Unit[], completed: Set<string>): { unit: Unit; stationId: StationId } | null {
  for (const unit of units) {
    if (unit.status !== "ready") continue;
    for (const st of unit.stations) {
      if (!completed.has(`${unit.id}/${st.id}`)) return { unit, stationId: st.id };
    }
  }
  return null;
}
