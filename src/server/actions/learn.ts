"use server";

import { z } from "zod";
import { StationId } from "@content/schema";
import { getCourse, getUnit } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { repo } from "@/server/repo";
import { today } from "@/server/today";
import { grade } from "@/core/exercises/grade";
import type { Exercise, Grade } from "@/core/exercises/types";
import { review, NEW_ITEM } from "@/core/srs/leitner";
import { buildReviewSession, buildStationSession } from "@/core/session/build";
import { computeStreak, starsFor } from "@/core/rewards";
import { addDays } from "@/core/date";
import { randomUUID } from "node:crypto";

/** Tiến độ ôn của mọi item tiếng Anh dùng chung một phạm vi. */
const progressScope = (courseId: string) => getCourse(courseId)?.subject ?? courseId;

const Begin = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("station"), courseId: z.string(), unitId: z.string(), stationId: StationId }),
  z.object({ kind: z.literal("review"), courseId: z.string() }),
]);

export type BeginResult = { sessionId: string; exercises: Exercise[] };

export async function beginSession(input: z.infer<typeof Begin>): Promise<BeginResult> {
  const args = Begin.parse(input);
  const { child, parent } = await requireChild();
  const course = getCourse(args.courseId);
  if (!course) throw new Error("Không có khóa học này");

  let exercises: Exercise[];
  if (args.kind === "station") {
    const unit = getUnit(course.id, args.unitId);
    if (!unit || unit.status !== "ready") throw new Error("Unit chưa sẵn sàng");
    exercises = buildStationSession(unit, args.stationId, randomUUID());
  } else {
    const progress = await repo.getProgress(child.id, progressScope(course.id));
    const unitOf = (itemId: string) =>
      course.units.find((u) => u.words.includes(itemId) || u.patterns.some((p) => p.id === itemId));
    exercises = buildReviewSession(progress, unitOf, today(parent.timezone), randomUUID());
  }

  const kind = args.kind === "station" && args.stationId === "challenge" ? "challenge" : args.kind;
  const sessionId = await repo.startSession(
    child.id, course.id, kind,
    args.kind === "station" ? args.unitId : undefined,
    args.kind === "station" ? args.stationId : undefined,
  );
  return { sessionId, exercises };
}

const ExerciseShape = z.looseObject({
  key: z.string(),
  kind: z.string(),
  itemId: z.string().nullable(),
});
const ResponseShape = z.discriminatedUnion("type", [
  z.object({ type: z.literal("choice"), choiceId: z.string().max(200) }),
  z.object({ type: z.literal("text"), text: z.string().max(200) }),
  z.object({ type: z.literal("speech"), transcript: z.string().max(500), selfReported: z.boolean().optional() }),
  z.object({ type: z.literal("done") }),
]);
const Submit = z.object({
  sessionId: z.uuid(),
  courseId: z.string(),
  exercise: ExerciseShape,
  response: ResponseShape,
  firstTry: z.boolean(),
  latencyMs: z.number().int().min(0).max(600_000).nullable(),
});

/**
 * Chấm lại câu trả lời ở server rồi lưu. Bài tập do server sinh ở `beginSession`;
 * đây là web gia đình nên server chấm lại bằng cùng hàm `grade`, không ký số bài tập.
 */
export async function submitAttempt(input: z.infer<typeof Submit>): Promise<Grade> {
  const args = Submit.parse(input);
  const { child, parent } = await requireChild();
  const ex = args.exercise as unknown as Exercise;
  const result = grade(ex, args.response);

  const scope = progressScope(args.courseId);
  let next: { box: number; dueOn: string } | null = null;
  if (ex.itemId && args.firstTry) {
    const prev = (await repo.getProgress(child.id, scope)).find((p) => p.itemId === ex.itemId) ?? NEW_ITEM;
    const state = review(prev, result.correct, today(parent.timezone));
    next = { box: state.box, dueOn: state.dueOn! };
  }

  await repo.recordAttempt({
    sessionId: args.sessionId, childId: child.id, courseId: args.courseId, progressCourseId: scope,
    itemId: ex.itemId, exercise: ex.kind, isCorrect: result.correct, firstTry: args.firstTry,
    score: result.score, response: args.response, latencyMs: args.latencyMs, next,
  });
  return result;
}

const Finish = z.object({
  sessionId: z.uuid(),
  courseId: z.string(),
  unitId: z.string().optional(),
  stationId: StationId.optional(),
  firstTryCorrect: z.number().int().min(0),
  total: z.number().int().min(0),
  seconds: z.number().int().min(0).max(4 * 3600),
  spoken: z.number().int().min(0),
});

export type FinishResult = { stars: 1 | 2 | 3; streak: number; minutesToday: number; goalMin: number };

export async function finishSession(input: z.infer<typeof Finish>): Promise<FinishResult> {
  const args = Finish.parse(input);
  const { child, parent } = await requireChild();
  const day = today(parent.timezone);
  const stars = starsFor(args.firstTryCorrect, args.total);
  await repo.finishSession({
    sessionId: args.sessionId, childId: child.id, stars, firstTryCorrect: args.firstTryCorrect, total: args.total,
    seconds: args.seconds, spoken: args.spoken, day,
    station: args.unitId && args.stationId ? { courseId: args.courseId, unitId: args.unitId, stationId: args.stationId } : undefined,
  });
  const activity = await repo.getActivity(child.id, addDays(day, -60));
  const todayAct = activity.find((a) => a.day === day);
  return {
    stars,
    streak: computeStreak(activity.filter((a) => a.sessionsCount > 0).map((a) => a.day), day),
    minutesToday: Math.round((todayAct?.seconds ?? 0) / 60),
    goalMin: child.dailyGoalMin,
  };
}
