"use server";

import { z } from "zod";
import { dialogues, findPattern, getCourse } from "@content/courses";
import { requireChild } from "@/server/auth/session";
import { repo } from "@/server/repo";
import { acceptedAnswers, chooseSlots, determinedValues, questionOf } from "@/core/exercises/generate";
import { createRng, seedFrom, shuffle } from "@/core/random";
import { scoreSpeech, type SpeechScore } from "@/core/grading/speech";
import { fillSlots } from "@content/schema";
import { randomUUID } from "node:crypto";
import { isDue } from "@/core/srs/leitner";
import { today } from "@/server/today";
import type { Pattern } from "@content/schema";
import { studiedPatterns } from "@/core/session/talk-pool";

export type QuickQuestion = {
  patternId: string;
  question: string;
  image?: string;
  /** Slot bé phải nói đúng giá trị (vd. country = "Japan" khi có hình cờ); slot khác chấp nhận mọi giá trị. */
  fixed: Record<string, string>;
  model: string;
  /** Mọi câu trả lời hợp lệ: để máy dừng nghe ngay khi bé nói đúng (không chỉ câu mẫu). */
  accept: string[];
};

export type TalkTurn = { say: string; expectPattern?: string; hints: string[]; accept: string[] };

export type BeginTalkResult =
  | { conversationId: string; sessionId: string; courseId: string; mode: "quick" | "speed"; questions: QuickQuestion[]; units: string[] }
  | { conversationId: string; sessionId: string; courseId: string; mode: "roleplay"; title: string; titleVi: string; friend: { name: string; country: string }; turns: TalkTurn[]; round: number };

const Begin = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("quick"), courseId: z.string() }),
  z.object({ mode: z.literal("speed"), courseId: z.string() }),
  z.object({ mode: z.literal("roleplay"), dialogueId: z.string(), round: z.number().int().min(1).max(3) }),
]);

export async function beginTalk(input: z.infer<typeof Begin>): Promise<BeginTalkResult> {
  const args = Begin.parse(input);
  const { child } = await requireChild();

  if (args.mode === "roleplay") {
    const d = dialogues.find((x) => x.id === args.dialogueId);
    if (!d) throw new Error("Không có kịch bản này");
    const conversationId = await repo.startConversation(child.id, d.courseId, "roleplay", d.id, args.round);
    const sessionId = await repo.startSession(child.id, d.courseId, "talk");
    const turns = d.turns.map((t) => {
      const p = t.expectPattern ? findPattern(t.expectPattern)?.pattern : undefined;
      return { ...t, accept: p ? acceptedAnswers(p, {}) : [] };
    });
    return { conversationId, sessionId, courseId: d.courseId, mode: "roleplay", title: d.title, titleVi: d.titleVi, friend: d.friend, turns, round: args.round };
  }

  const course = getCourse(args.courseId);
  if (!course) throw new Error("Không có khóa học này");
  const { parent } = await requireChild();
  const [progress, stations] = await Promise.all([repo.getProgress(child.id, "english"), repo.getStations(child.id, course.id)]);
  const pool = studiedPatterns(course.units, new Set(stations.map((s) => s.unitId)), new Set(progress.map((p) => p.itemId)));
  const rng = createRng(seedFrom(randomUUID()));
  const day = today(parent.timezone);
  const state = new Map(progress.map((p) => [p.itemId, p]));
  // Ưu tiên câu đến hạn ôn và câu hay sai (hộp thấp), sau đó trộn ngẫu nhiên các câu đã học
  const due = shuffle(pool.patterns.filter((p) => { const st = state.get(p.id); return !!st && isDue(st, day); }), rng)
    .sort((x, y) => (state.get(x.id)?.box ?? 0) - (state.get(y.id)?.box ?? 0));
  const rest = shuffle(pool.patterns.filter((p) => !due.includes(p)), rng);
  const count = args.mode === "speed" ? 10 : 8;
  const order: Pattern[] = [];
  // Mỗi mẫu câu tối đa 2 lần, không hỏi cùng mẫu liền nhau
  for (const p of [...due, ...rest, ...shuffle([...due, ...rest], rng), ...shuffle([...due, ...rest], rng)]) {
    if (order.length >= count) break;
    if (order.at(-1)?.id === p.id || order.filter((x) => x.id === p.id).length >= 2) continue;
    order.push(p);
  }
  const questions: QuickQuestion[] = order.map((p) => {
    const askAboutChild = /\byou\b/i.test(p.question);
    const { values, image, imageSlot } = chooseSlots(p, rng);
    const fixed = determinedValues(p, values, askAboutChild ? undefined : imageSlot);
    return {
      patternId: p.id,
      question: questionOf(p, values),
      // Hỏi về chính bé: không hiện hình, bé tự trả lời theo ý mình
      image: askAboutChild ? undefined : image,
      fixed,
      model: fillSlots(p.answer, values),
      accept: acceptedAnswers(p, fixed),
    };
  });
  const conversationId = await repo.startConversation(child.id, course.id, "quick", null, 1);
  const sessionId = await repo.startSession(child.id, course.id, "talk");
  return { conversationId, sessionId, courseId: course.id, mode: args.mode, questions, units: pool.labels };
}

const Turn = z.object({
  conversationId: z.uuid(),
  botText: z.string().max(300),
  patternId: z.string().nullable(),
  fixed: z.record(z.string().max(30), z.string().max(60)).default({}),
  transcript: z.string().max(500),
  latencyMs: z.number().int().min(0).max(120_000).nullable(),
  hintLevel: z.number().int().min(0).max(3),
  selfReported: z.boolean().default(false),
});

/** Lưu một lượt hỏi–đáp và chấm câu trả lời của bé ở server. */
export async function recordTurn(input: z.input<typeof Turn>): Promise<SpeechScore | null> {
  const args = Turn.parse(input);
  const { child } = await requireChild();
  await repo.addTurn({ conversationId: args.conversationId, childId: child.id, speaker: "bot", text: args.botText });

  let score: SpeechScore | null = null;
  if (args.patternId) {
    const found = findPattern(args.patternId);
    if (!found) throw new Error("Không có mẫu câu này");
    const accept = acceptedAnswers(found.pattern, args.fixed);
    score = args.selfReported
      ? { score: 1, passed: true, expected: accept[0], words: [] }
      : scoreSpeech(args.transcript, accept);
  }
  await repo.addTurn({
    conversationId: args.conversationId, childId: child.id, speaker: "child", text: args.transcript || "(tự nói theo)",
    expectedItemId: args.patternId, score: score?.score ?? null, latencyMs: args.latencyMs, hintLevel: args.hintLevel,
  });
  return score;
}

export async function finishTalk(conversationId: string): Promise<void> {
  z.uuid().parse(conversationId);
  const { child } = await requireChild();
  await repo.finishConversation(conversationId, child.id);
}
