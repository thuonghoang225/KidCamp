import "server-only";
import { cache } from "react";
import { addDays } from "@/core/date";
import { computeStreak } from "@/core/rewards";
import { repo, type Child, type Parent } from "@/server/repo";
import { today } from "@/server/today";
import { courses } from "@content/courses";

export type KidSummary = {
  streak: number;
  totalStars: number;
  minutesToday: number;
  goalMin: number;
  faceUrl: string | null;
  completed: Set<string>;
  stationStars: Map<string, number>;
  dueCount: number;
};

/** Số liệu hiển thị trên đầu trang của bé: chuỗi ngày, tổng sao, phút hôm nay. */
export const getKidSummary = cache(async (parent: Parent, child: Child): Promise<KidSummary> => {
  const day = today(parent.timezone);
  const [activity, faceUrl, progress, ...stationLists] = await Promise.all([
    repo.getActivity(child.id, addDays(day, -90)),
    child.avatarPath ? repo.avatarUrl(child.avatarPath) : Promise.resolve(null),
    repo.getProgress(child.id, "english"),
    ...[...courses.keys()].map((id) => repo.getStations(child.id, id)),
  ]);
  const stations = stationLists.flat();
  const stationStars = new Map(stations.map((s) => [`${s.unitId}/${s.stationId}`, s.bestStars]));
  return {
    streak: computeStreak(activity.filter((a) => a.sessionsCount > 0).map((a) => a.day), day),
    totalStars: stations.reduce((sum, s) => sum + s.bestStars, 0),
    minutesToday: Math.round((activity.find((a) => a.day === day)?.seconds ?? 0) / 60),
    goalMin: child.dailyGoalMin,
    faceUrl,
    completed: new Set(stationStars.keys()),
    stationStars,
    dueCount: progress.filter((p) => p.dueOn !== null && p.dueOn <= day).length,
  };
});
