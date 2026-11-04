"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { clsx } from "clsx";
import type { StationId } from "@content/schema";
import { grade } from "@/core/exercises/grade";
import type { Exercise, Grade, Response } from "@/core/exercises/types";
import { beginSession, finishSession, submitAttempt, type FinishResult } from "@/server/actions/learn";
import { speaker } from "@/subjects/english/speech/speaker";
import { sfx, SFX_GAP_MS } from "@/core/sfx";
import { isVoicePreference } from "@/subjects/english/speech/audio-key";
import { SpeedToggle } from "./SpeedToggle";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { faArrowRight, faFire, faVolumeHigh, faVolumeXmark, faXmark } from "@/components/icons";
import { Stars } from "@/components/kid/Stars";
import { KidCharacter } from "@/components/kid/KidCharacter";
import { ChoiceView } from "./ChoiceView";
import { TilesView } from "./TilesView";
import { SayView } from "./SayView";
import { ChantView } from "./ChantView";

type Begin =
  | { kind: "station"; courseId: string; unitId: string; stationId: StationId }
  | { kind: "review"; courseId: string };

type QueueItem = { ex: Exercise; firstTry: boolean };

const PRAISE = ["Giỏi quá!", "Chính xác!", "Tuyệt vời!", "Đúng rồi!", "Siêu ghê!"];

export function Runner({
  begin, title, backHref, faceUrl, costumeId, voice = "rotate",
}: { begin: Begin; title: string; backHref: string; faceUrl: string | null; costumeId: string; voice?: string }) {
  // Giọng phụ huynh chọn; đặt ngay khi render để câu đầu tiên đã đúng giọng
  if (isVoicePreference(voice) && speaker.preference !== voice) speaker.setPreference(voice);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<(Grade & { picked: string | null }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<FinishResult | null>(null);
  const [empty, setEmpty] = useState(false);
  const [, startTransition] = useTransition();

  const stats = useRef({ firstTryCorrect: 0, total: 0, spoken: 0, startedAt: 0 });
  const shownAt = useRef(0);

  useEffect(() => {
    let cancelled = false;
    beginSession(begin)
      .then((res) => {
        if (cancelled) return;
        if (res.exercises.length === 0) return setEmpty(true);
        setSessionId(res.sessionId);
        setQueue(res.exercises.map((ex) => ({ ex, firstTry: true })));
        stats.current = { firstTryCorrect: 0, total: res.exercises.length, spoken: 0, startedAt: Date.now() };
        shownAt.current = Date.now();
      })
      .catch(() => !cancelled && setError("Không tải được bài học. Kiểm tra mạng rồi thử lại nhé."));
    return () => {
      cancelled = true;
      speaker.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = queue[index];

  const answer = useCallback(
    (res: Response) => {
      if (!current || feedback || !sessionId) return;
      const g = grade(current.ex, res);
      const picked = res.type === "choice" ? res.choiceId : null;
      setFeedback({ ...g, picked });
      if (current.firstTry && g.correct) stats.current.firstTryCorrect += 1;
      if (res.type === "speech") stats.current.spoken += 1;
      if (g.correct) sfx.correct();
      else {
        sfx.wrong();
        setTimeout(() => void speaker.play(g.expected), sfx.isMuted() ? 0 : SFX_GAP_MS);
        // Câu sai lần đầu được hỏi lại ở cuối buổi
        if (current.firstTry) setQueue((q) => [...q, { ex: current.ex, firstTry: false }]);
      }
      const latencyMs = Math.min(Date.now() - shownAt.current, 600_000);
      startTransition(() => {
        submitAttempt({ sessionId, courseId: begin.courseId, exercise: current.ex, response: res, firstTry: current.firstTry, latencyMs }).catch(() => {
          /* lưu thất bại không chặn bé học tiếp */
        });
      });
    },
    [current, feedback, sessionId, begin.courseId],
  );

  async function next() {
    setFeedback(null);
    shownAt.current = Date.now();
    speaker.nextVoice(); // khi để "Luân phiên": mỗi bài một giọng
    if (index + 1 < queue.length) return setIndex(index + 1);
    const s = stats.current;
    const result = await finishSession({
      sessionId: sessionId!,
      courseId: begin.courseId,
      unitId: begin.kind === "station" ? begin.unitId : undefined,
      stationId: begin.kind === "station" ? begin.stationId : undefined,
      firstTryCorrect: s.firstTryCorrect,
      total: s.total,
      seconds: Math.round((Date.now() - s.startedAt) / 1000),
      spoken: s.spoken,
    }).catch(() => null);
    setSummary(result ?? { stars: 1, streak: 0, minutesToday: 0, goalMin: 25 });
  }

  if (error) return <Centered><p className="text-xl font-bold text-ember-600">{error}</p><ButtonLink href={backHref} tone="white">Quay lại</ButtonLink></Centered>;
  if (empty)
    return (
      <Centered>
        <Image src="/img/emoji/party-popper.png" alt="" width={120} height={120} />
        <p className="text-2xl font-black">Hôm nay chưa có gì cần ôn!</p>
        <p className="text-muted">Con học bài mới rồi mai quay lại ôn nhé.</p>
        <ButtonLink href={backHref} size="lg">Về trại</ButtonLink>
      </Centered>
    );
  if (summary) return <Summary summary={summary} backHref={backHref} faceUrl={faceUrl} costumeId={costumeId} />;
  if (!current) return <Centered><p className="text-xl font-bold text-muted animate-pulse">Đang chuẩn bị bài…</p></Centered>;

  const progress = Math.min(index / queue.length, 1);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-40 pt-4">
      <header className="mb-6 flex items-center gap-4">
        <ButtonLink href={backHref} tone="ghost" aria-label="Thoát">
          <Icon icon={faXmark} className="text-2xl" />
        </ButtonLink>
        <div className="h-5 flex-1 overflow-hidden rounded-full bg-forest-100" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full bg-forest-500" animate={{ width: `${progress * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-muted">{title}</span>
        <SpeedToggle />
        <SfxToggle />
      </header>

      <AnimatePresence mode="wait">
        <motion.div key={current.ex.key + index} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }}>
          <ExerciseView ex={current.ex} onAnswer={answer} locked={!!feedback} picked={feedback?.picked ?? null} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            className={clsx("fixed inset-x-0 bottom-0 z-20 border-t-4 px-4 py-5", feedback.correct ? "border-forest-200 bg-forest-50" : "border-ember-100 bg-ember-100")}
          >
            <div className="mx-auto flex max-w-4xl items-center gap-4">
              <KidCharacter faceUrl={faceUrl} costumeId={costumeId} pose={feedback.correct ? "cheer" : "stand"} className="h-20 w-16 shrink-0" />
              <div className="flex-1">
                <p className={clsx("text-2xl font-black", feedback.correct ? "text-forest-700" : "text-ember-600")}>
                  {feedback.correct ? PRAISE[index % PRAISE.length] : "Chưa đúng, mình học lại nhé!"}
                </p>
                {!feedback.correct && <p className="text-lg font-bold">Đáp án: {feedback.expected}</p>}
              </div>
              <Button size="lg" tone={feedback.correct ? "forest" : "ember"} onClick={next} autoFocus>
                Tiếp <Icon icon={faArrowRight} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExerciseView({ ex, onAnswer, locked, picked }: { ex: Exercise; onAnswer: (r: Response) => void; locked: boolean; picked: string | null }) {
  switch (ex.kind) {
    case "listen-pick-image":
    case "image-pick-word":
    case "pick-answer":
    case "pick-sound":
      return <ChoiceView ex={ex} onAnswer={onAnswer} locked={locked} picked={picked} />;
    case "spell-word":
    case "order-words":
      return <TilesView ex={ex} onAnswer={onAnswer} locked={locked} />;
    case "say-word":
    case "say-sentence":
      return <SayView ex={ex} onAnswer={onAnswer} locked={locked} />;
    case "chant":
      return <ChantView ex={ex} onAnswer={onAnswer} locked={locked} />;
  }
}

/** Nút bật/tắt tiếng hiệu ứng đúng/sai (không ảnh hưởng giọng đọc). */
function SfxToggle() {
  const muted = useSyncExternalStore(sfx.subscribe, sfx.isMuted, () => false);
  return (
    <Button
      tone="ghost"
      aria-label={muted ? "Bật tiếng hiệu ứng" : "Tắt tiếng hiệu ứng"}
      aria-pressed={!muted}
      onClick={() => {
        sfx.setMuted(!muted);
        if (muted) sfx.correct();
      }}
    >
      <Icon icon={muted ? faVolumeXmark : faVolumeHigh} className={clsx("text-xl", muted ? "text-muted" : "text-forest-600")} />
    </Button>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">{children}</div>;
}

function Summary({ summary, backHref, faceUrl, costumeId }: { summary: FinishResult; backHref: string; faceUrl: string | null; costumeId: string }) {
  useEffect(() => {
    sfx.finish();
    const t = setTimeout(() => void speaker.play(summary.stars === 3 ? "Excellent!" : "Good job!"), sfx.isMuted() ? 0 : 900);
    return () => clearTimeout(t);
  }, [summary.stars]);
  return (
    <Centered>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
        <KidCharacter faceUrl={faceUrl} costumeId={costumeId} pose="cheer" className="h-56 w-44" />
      </motion.div>
      <p className="text-4xl font-black text-forest-700">Hoàn thành!</p>
      <Stars value={summary.stars} size="text-5xl" />
      <div className="flex flex-wrap justify-center gap-3 text-lg font-bold">
        <span className="rounded-full bg-ember-100 px-4 py-2 text-ember-700">
          <Icon icon={faFire} /> {summary.streak} ngày liên tiếp
        </span>
        <span className="rounded-full bg-sky-100 px-4 py-2 text-sky-700">
          Hôm nay: {summary.minutesToday}/{summary.goalMin} phút
        </span>
      </div>
      <ButtonLink href={backHref} size="xl" className="mt-4">
        Tiếp tục <Icon icon={faArrowRight} />
      </ButtonLink>
    </Centered>
  );
}
