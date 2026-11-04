"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import { beginTalk, finishTalk, recordTurn, type BeginTalkResult } from "@/server/actions/talk";
import { finishSession } from "@/server/actions/learn";
import type { SpeechScore } from "@/core/grading/speech";
import { sfx } from "@/core/sfx";
import { speaker } from "@/subjects/english/speech/speaker";
import { FRIEND_VOICES, isVoicePreference } from "@/subjects/english/speech/audio-key";
import { SpeedToggle } from "@/components/exercises/SpeedToggle";
import { listener, ListenError } from "@/subjects/english/speech/listener";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { FriendCharacter } from "@/components/kid/FriendCharacter";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faArrowRight, faCheck, faLightbulb, faMicrophone, faXmark, faClock, faComments } from "@/components/icons";

type Begin = { mode: "quick"; courseId: string } | { mode: "roleplay"; dialogueId: string; round: number };

/** Một bước của cuộc nói chuyện: nhân vật nói, có thể chờ bé trả lời. */
type Step = { say: string; expectPattern: string | null; fixed: Record<string, string>; hints: string[]; image?: string };

type Bubble = { who: "bot" | "kid"; text: string; score?: SpeechScore | null };

const MAX_TRIES = 2;
const noopSubscribe = () => () => {};

function toSteps(t: BeginTalkResult): Step[] {
  if (t.mode === "quick") {
    return [
      { say: "Hi! Let's talk. Answer quickly!", expectPattern: null, fixed: {}, hints: [] },
      ...t.questions.map((q) => ({
        say: q.question, expectPattern: q.patternId, fixed: q.fixed, image: q.image,
        hints: [q.model, q.model.split(" ").slice(0, -1).join(" ") + " …", q.model.split(" ")[0] + " …"],
      })),
      { say: "Great job! See you!", expectPattern: null, fixed: {}, hints: [] },
    ];
  }
  return t.turns.map((x) => ({ say: x.say, expectPattern: x.expectPattern ?? null, fixed: {}, hints: x.hints }));
}

export function Talk({
  begin, backHref, faceUrl, costumeId, childName, voice = "rotate",
}: { begin: Begin; backHref: string; faceUrl: string | null; costumeId: string; childName: string; voice?: string }) {
  if (isVoicePreference(voice) && speaker.preference !== voice) speaker.setPreference(voice);
  const [talk, setTalk] = useState<BeginTalkResult | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [i, setI] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [phase, setPhase] = useState<"loading" | "bot" | "kid" | "listening" | "feedback" | "done">("loading");
  const [hintLevel, setHintLevel] = useState(0);
  const [tries, setTries] = useState(0);
  const canListen = useSyncExternalStore(noopSubscribe, () => listener.isSupported(), () => true);
  const [blocked, setBlocked] = useState(false);
  const supported = canListen && !blocked;
  const [stats, setStats] = useState({ spoken: 0, passed: 0, latencies: [] as number[] });
  const [error, setError] = useState<string | null>(null);
  const kidTurnAt = useRef(0);
  const startedAt = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  // Giá trị mới nhất cho các callback bất đồng bộ (tránh closure cũ)
  // Bạn Lucy giữ một giọng nữ trong cả cuộc nói chuyện; lần sau đổi sang giọng khác
  const friendVoice = useRef(FRIEND_VOICES[0]);
  const live = useRef({ talk: null as BeginTalkResult | null, steps: [] as Step[], i: 0, stats: { spoken: 0, passed: 0 }, alive: true });
  useEffect(() => {
    live.current.stats = stats;
  }, [stats]);

  const round = begin.mode === "roleplay" ? begin.round : 2;
  const step = steps[i];

  /** Nhân vật nói câu của bước `index`, rồi chờ bé trả lời hoặc tự sang bước sau. */
  function runStep(index: number) {
    const { steps: all } = live.current;
    const st = all[index];
    if (!st) return void finish();
    live.current.i = index;
    setI(index);
    setPhase("bot");
    setBubbles((b) => [...b, { who: "bot", text: st.say }]);
    void speaker.play(st.say, { rate: 0.85, voice: friendVoice.current }).then(() => {
      if (!live.current.alive) return;
      if (st.expectPattern) {
        // Lượt 1 hiện sẵn câu mẫu; lượt 2–3 bé tự nói, bấm Gợi ý khi cần
        setHintLevel(round === 1 ? 1 : 0);
        setTries(0);
        kidTurnAt.current = Date.now();
        setPhase("kid");
      } else {
        setTimeout(() => live.current.alive && runStep(index + 1), 600);
      }
    });
  }

  useEffect(() => {
    const state = live.current;
    state.alive = true;
    // Giọng cố định: Lucy nói bằng giọng đã chọn; luân phiên: Lucy luôn là giọng nữ
    const v = speaker.nextVoice();
    friendVoice.current = speaker.preference !== "rotate" ? v : v === "michael" ? FRIEND_VOICES[1] : FRIEND_VOICES[0];
    beginTalk(begin)
      .then((t) => {
        startedAt.current = Date.now();
        const all = toSteps(t);
        live.current.talk = t;
        live.current.steps = all;
        setTalk(t);
        setSteps(all);
        runStep(0);
      })
      .catch(() => setError("Không tải được bài nói chuyện."));
    return () => {
      state.alive = false;
      speaker.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, phase]);

  function advance() {
    runStep(live.current.i + 1);
  }

  async function finish() {
    setPhase("done");
    const { talk: t, stats: st } = live.current;
    if (!t) return;
    await finishTalk(t.conversationId).catch(() => undefined);
    await finishSession({
      sessionId: t.sessionId, courseId: t.courseId,
      firstTryCorrect: st.passed, total: Math.max(st.spoken, 1),
      seconds: Math.round((Date.now() - startedAt.current) / 1000), spoken: st.spoken,
    }).catch(() => undefined);
  }

  async function submit(transcript: string, selfReported: boolean) {
    if (!talk || !step) return;
    const latencyMs = Math.min(Date.now() - kidTurnAt.current, 120_000);
    setPhase("feedback");
    const score = await recordTurn({
      conversationId: talk.conversationId, botText: step.say, patternId: step.expectPattern, fixed: step.fixed,
      transcript, latencyMs, hintLevel, selfReported,
    }).catch(() => null);
    setBubbles((b) => [...b, { who: "kid", text: selfReported ? "(con đã nói)" : transcript || "…", score }]);
    const passed = score?.passed ?? false;
    const n = tries + 1;
    setTries(n);
    setStats((s) => ({
      spoken: s.spoken + 1,
      passed: s.passed + (passed && n === 1 ? 1 : 0),
      latencies: n === 1 ? [...s.latencies, latencyMs] : s.latencies,
    }));
    if (passed) sfx.correct();
    else sfx.wrong();
    if (passed || n >= MAX_TRIES) {
      if (!passed && step.hints[0]) {
        await new Promise((r) => setTimeout(r, 450));
        setBubbles((b) => [...b, { who: "bot", text: `We say: “${step.hints[0]}”` }]);
        await speaker.play(step.hints[0], { voice: friendVoice.current });
      }
      setTimeout(advance, passed ? 500 : 900);
    } else {
      setBubbles((b) => [...b, { who: "bot", text: "Try again!" }]);
      await new Promise((r) => setTimeout(r, 450));
      await speaker.play("Try again!", { voice: friendVoice.current });
      setHintLevel((h) => Math.max(h, 1));
      kidTurnAt.current = Date.now();
      setPhase("kid");
    }
  }

  async function listen() {
    setPhase("listening");
    try {
      const { transcript } = await listener.listen({ expected: step?.hints.slice(0, 1) });
      await submit(transcript, false);
    } catch (e) {
      const code = e instanceof ListenError ? e.code : "other";
      if (code === "not-allowed" || code === "not-supported") setBlocked(true);
      setPhase("kid");
    }
  }

  if (error) return <div className="flex flex-1 items-center justify-center p-6 text-xl font-bold text-ember-600">{error}</div>;

  if (phase === "done") {
    const avg = stats.latencies.length ? stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length / 1000 : null;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <div className="flex items-end gap-4">
          <FriendCharacter className="h-40 w-32" />
          <KidCharacter faceUrl={faceUrl} costumeId={costumeId} pose="cheer" className="h-48 w-36" />
        </div>
        <p className="text-4xl font-black text-forest-700">Giỏi lắm, {childName}!</p>
        <div className="flex flex-wrap justify-center gap-3 text-lg font-bold">
          <span className="rounded-full bg-forest-100 px-4 py-2 text-forest-700"><Icon icon={faComments} /> {stats.spoken} câu đã nói</span>
          {avg !== null && <span className="rounded-full bg-sky-100 px-4 py-2 text-sky-700"><Icon icon={faClock} /> phản xạ {avg.toFixed(1)} giây</span>}
        </div>
        <ButtonLink href={backHref} size="xl">Tiếp tục <Icon icon={faArrowRight} /></ButtonLink>
      </div>
    );
  }

  const kidTurn = phase === "kid" || phase === "listening";
  // Gợi ý: lượt 1 = câu đầy đủ, lượt 2 = khung câu, lượt 3 = chữ đầu; mỗi lần bấm thêm thì gợi ý rõ hơn
  const hintIndex = Math.max(0, Math.min(round - 1, (step?.hints.length ?? 1) - 1) - (hintLevel - 1));
  const hint = step && hintLevel > 0 ? step.hints[hintIndex] ?? null : null;

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4 pt-3">
      <header className="flex items-center gap-3">
        <ButtonLink href={backHref} tone="ghost" aria-label="Thoát"><Icon icon={faXmark} className="text-2xl" /></ButtonLink>
        <p className="font-black text-forest-700">
          {talk?.mode === "roleplay" ? `${talk.titleVi} · Lượt ${talk.round}` : "Hỏi nhanh"}
        </p>
        <span className="ml-auto text-sm font-bold text-muted">{Math.min(i + 1, steps.length)}/{steps.length}</span>
        <SpeedToggle />
      </header>

      <div className="flex items-end justify-between gap-2 pt-2">
        <div className="flex flex-col items-center">
          <FriendCharacter className="h-28 w-20 sm:h-36 sm:w-28" active={phase === "bot"} name={talk?.mode === "roleplay" ? talk.friend.name : "Lucy"} />
          <span className="text-sm font-bold text-muted">{talk?.mode === "roleplay" ? talk.friend.name : "Lucy"}</span>
        </div>
        <div className="flex flex-col items-center">
          <KidCharacter faceUrl={faceUrl} costumeId={costumeId} className="h-28 w-20 sm:h-36 sm:w-28" active={kidTurn} pose={kidTurn ? "wave" : "stand"} />
          <span className={clsx("text-sm font-black", kidTurn ? "text-ember-600" : "text-muted")}>{kidTurn ? "Lượt của con!" : childName}</span>
        </div>
      </div>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto py-4">
        <AnimatePresence initial={false}>
          {bubbles.map((b, k) => (
            <motion.div key={k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={clsx("flex", b.who === "kid" ? "justify-end" : "justify-start")}>
              <div className={clsx("max-w-[80%] rounded-3xl px-5 py-3 text-xl font-bold", b.who === "bot" ? "rounded-bl-md bg-white shadow-[var(--shadow-soft)]" : "rounded-br-md bg-forest-600 text-white")}>
                {b.score && b.score.words.length > 0 && !b.score.passed ? (
                  <>
                    {b.text}
                    <span className="mt-1 block text-sm font-bold">Chưa khớp: {b.score.words.filter((w) => !w.matched).map((w) => w.word).join(", ")}</span>
                  </>
                ) : (
                  <>
                    {b.text} {b.score?.passed && <Icon icon={faCheck} className="ml-1 text-sun-300" />}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {step?.image && kidTurn && (
          <div className="flex justify-end">
            <Image src={step.image} alt="" width={72} height={72} className="h-16 w-16 rounded-xl object-contain" />
          </div>
        )}
      </div>

      <div className="border-t-2 border-forest-100 py-4">
        {kidTurn ? (
          <div className="flex flex-col items-center gap-3">
            {hint && <p className="rounded-2xl bg-sun-100 px-4 py-2 text-xl font-extrabold text-ink">{hint}</p>}
            <div className="flex items-center gap-4">
              <Button tone="white" onClick={() => setHintLevel((h) => Math.min(h + 1, 3))} disabled={!step?.hints.length || hintLevel >= 3}>
                <Icon icon={faLightbulb} /> Gợi ý
              </Button>
              {supported ? (
                <button
                  type="button"
                  onClick={listen}
                  disabled={phase === "listening"}
                  aria-label="Bấm để nói"
                  className={clsx("btn-candy flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white", phase === "listening" ? "bg-ember-500 animate-pulse ring-8 ring-ember-100" : "bg-forest-500")}
                >
                  <Icon icon={faMicrophone} />
                </button>
              ) : (
                <Button size="lg" onClick={() => submit("", true)}><Icon icon={faCheck} /> Con đã nói</Button>
              )}
            </div>
            <p className="text-sm font-bold text-muted">{phase === "listening" ? "Đang nghe…" : supported ? "Bấm micro rồi nói" : "Nói to rồi bấm nút"}</p>
          </div>
        ) : (
          <p className="text-center text-lg font-bold text-muted">{phase === "loading" ? "Đang chuẩn bị…" : "Nghe bạn nói nhé…"}</p>
        )}
      </div>
    </div>
  );
}
