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

export type QuickQuestion = {
  patternId: string;
  question: string;
  image?: string;
  /** Slot bé phải nói đúng giá trị (vd. country = "Japan" khi có hình cờ); slot khác chấp nhận mọi giá trị. */
  fixed: Record<string, string>;
  model: string;
};

export type TalkTurn = { say: string; expectPattern?: string; hints: string[] };

export type BeginTalkResult =
  | { conversationId: string; sessionId: string; courseId: string; mode: "quick"; questions: QuickQuestion[] }
  | { conversationId: string; sessionId: string; courseId: string; mode: "roleplay"; title: string; titleVi: string; friend: { name: string; country: string }; turns: TalkTurn[]; round: number };

const Begin = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("quick"), courseId: z.string() }),
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
    return { conversationId, sessionId, courseId: d.courseId, mode: "roleplay", title: d.title, titleVi: d.titleVi, friend: d.friend, turns: d.turns, round: args.round };
  }

  const course = getCourse(args.courseId);
  if (!course) throw new Error("Không có khóa học này");
  const rng = createRng(seedFrom(randomUUID()));
  const patterns = course.units.filter((u) => u.status === "ready").flatMap((u) => u.patterns);
  const questions: QuickQuestion[] = [];
  for (const p of shuffle([...patterns, ...patterns], rng).slice(0, 8)) {
    const askAboutChild = /\byou\b/i.test(p.question);
    const { values, image, imageSlot } = chooseSlots(p, rng);
    const fixed = determinedValues(p, values, askAboutChild ? undefined : imageSlot);
    questions.push({
      patternId: p.id,
      question: questionOf(p, values),
      // Hỏi về chính bé: không hiện hình, bé tự trả lời theo ý mình
      image: askAboutChild ? undefined : image,
      fixed,
      model: fillSlots(p.answer, values),
    });
  }
  const conversationId = await repo.startConversation(child.id, course.id, "quick", null, 1);
  const sessionId = await repo.startSession(child.id, course.id, "talk");
  return { conversationId, sessionId, courseId: course.id, mode: "quick", questions };
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
