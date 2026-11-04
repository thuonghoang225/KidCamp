import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Day } from "@/core/date";
import type { ProgressRow } from "@/core/session/build";
import type {
  ActivityRecord, AttemptInput, Child, FinishInput, Parent, Repo, SessionKind,
  StationRecord, TalkStats, TurnInput, WeakItem,
} from "./types";

/**
 * Bản Demo: lưu toàn bộ dữ liệu vào `.data/demo.json` trên máy đang chạy `pnpm dev`.
 * Dùng để thử web ngay mà chưa cần Supabase. Không dùng cho production.
 */

type Db = {
  parents: Record<string, { displayName: string | null; pinHash: string | null; timezone: string }>;
  children: Child[];
  progress: Array<ProgressRow & { childId: string; courseId: string; lastSeenAt: string }>;
  stations: Array<StationRecord & { childId: string; courseId: string }>;
  sessions: Array<{ id: string; childId: string; courseId: string; kind: SessionKind; unitId?: string; stationId?: string; startedAt: string; endedAt?: string }>;
  attempts: Array<{ childId: string; itemId: string | null; isCorrect: boolean; firstTry: boolean; at: string }>;
  activity: Array<ActivityRecord & { childId: string }>;
  conversations: Array<{ id: string; childId: string; mode: string; startedAt: string; endedAt?: string }>;
  turns: Array<TurnInput & { at: string }>;
};

const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "demo.json");
const empty = (): Db => ({ parents: {}, children: [], progress: [], stations: [], sessions: [], attempts: [], activity: [], conversations: [], turns: [] });

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  try {
    return { ...empty(), ...(JSON.parse(await readFile(FILE, "utf8")) as Partial<Db>) };
  } catch {
    return empty();
  }
}

/** Ghi tuần tự để tránh hai request ghi đè lên nhau. */
function tx<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await mkdir(DIR, { recursive: true });
    await writeFile(FILE, JSON.stringify(db, null, 2));
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

const read = <T>(fn: (db: Db) => T) => queue.then(load).then(fn);

/** Hồ sơ tạo từ bản cũ chưa có trường mới. */
const withDefaults = (c: Child): Child => ({ ...c, voice: c.voice ?? "rotate" });

export const demoRepo: Repo = {
  mode: "demo",

  getParent: (parentId) =>
    tx((db) => {
      db.parents[parentId] ??= { displayName: "Bố mẹ", pinHash: null, timezone: "Asia/Ho_Chi_Minh" };
      const p = db.parents[parentId];
      return { id: parentId, displayName: p.displayName, hasPin: !!p.pinHash, timezone: p.timezone } satisfies Parent;
    }),
  setPin: (parentId, pinHash) => tx((db) => void (db.parents[parentId].pinHash = pinHash)),
  getPinHash: (parentId) => read((db) => db.parents[parentId]?.pinHash ?? null),

  listChildren: (parentId) => read((db) => db.children.filter((c) => c.parentId === parentId).map(withDefaults)),
  getChild: (parentId, childId) => read((db) => { const c = db.children.find((x) => x.id === childId && x.parentId === parentId); return c ? withDefaults(c) : null; }),
  createChild: (parentId, nickname) =>
    tx((db) => {
      const child: Child = { id: randomUUID(), parentId, nickname, avatarPath: null, costumeId: "camper", voiceAccent: "en-US", voice: "rotate", dailyGoalMin: 25 };
      db.children.push(child);
      return child;
    }),
  updateChild: (parentId, childId, patch) =>
    tx((db) => {
      const c = db.children.find((x) => x.id === childId && x.parentId === parentId);
      if (c) Object.assign(c, patch);
    }),

  async saveAvatar(parentId, childId, webp) {
    const rel = `${parentId}/${childId}.webp`;
    await mkdir(path.join(DIR, "avatars", parentId), { recursive: true });
    await writeFile(path.join(DIR, "avatars", rel), webp);
    await this.updateChild(parentId, childId, { avatarPath: rel });
    return rel;
  },
  async deleteAvatar(parentId, childId) {
    await rm(path.join(DIR, "avatars", parentId, `${childId}.webp`), { force: true });
    await this.updateChild(parentId, childId, { avatarPath: null });
  },
  avatarUrl: async (p) => `/api/avatar/${encodeURIComponent(p)}?v=${Date.now() % 1e6}`,

  getProgress: (childId, courseId) =>
    read((db) => db.progress.filter((p) => p.childId === childId && p.courseId === courseId)),
  getStations: (childId, courseId) =>
    read((db) => db.stations.filter((s) => s.childId === childId && s.courseId === courseId)),

  startSession: (childId, courseId, kind, unitId, stationId) =>
    tx((db) => {
      const id = randomUUID();
      db.sessions.push({ id, childId, courseId, kind, unitId, stationId, startedAt: new Date().toISOString() });
      return id;
    }),

  recordAttempt: (a: AttemptInput) =>
    tx((db) => {
      db.attempts.push({ childId: a.childId, itemId: a.itemId, isCorrect: a.isCorrect, firstTry: a.firstTry, at: new Date().toISOString() });
      if (a.itemId && a.firstTry && a.next) {
        const row = db.progress.find((p) => p.childId === a.childId && p.courseId === a.progressCourseId && p.itemId === a.itemId);
        const lastSeenAt = new Date().toISOString();
        if (row) {
          Object.assign(row, { box: a.next.box, dueOn: a.next.dueOn, lastSeenAt });
          if (a.isCorrect) row.correctCount += 1;
          else row.wrongCount += 1;
        } else {
          db.progress.push({
            childId: a.childId, courseId: a.progressCourseId, itemId: a.itemId, box: a.next.box, dueOn: a.next.dueOn,
            correctCount: a.isCorrect ? 1 : 0, wrongCount: a.isCorrect ? 0 : 1, lastSeenAt,
          });
        }
      }
    }),

  finishSession: (f: FinishInput) =>
    tx((db) => {
      const s = db.sessions.find((x) => x.id === f.sessionId && x.childId === f.childId);
      if (!s || s.endedAt) return;
      s.endedAt = new Date().toISOString();
      const act = db.activity.find((a) => a.childId === f.childId && a.day === f.day);
      if (act) {
        act.seconds += f.seconds;
        act.sessionsCount += 1;
        act.spokenCount += f.spoken;
      } else {
        db.activity.push({ childId: f.childId, day: f.day, seconds: f.seconds, sessionsCount: 1, spokenCount: f.spoken });
      }
      if (f.station) {
        const st = db.stations.find((x) => x.childId === f.childId && x.courseId === f.station!.courseId && x.unitId === f.station!.unitId && x.stationId === f.station!.stationId);
        if (st) st.bestStars = Math.max(st.bestStars, f.stars);
        else db.stations.push({ childId: f.childId, ...f.station, bestStars: f.stars });
      }
    }),

  getActivity: (childId, since: Day) =>
    read((db) => db.activity.filter((a) => a.childId === childId && a.day >= since).sort((a, b) => a.day.localeCompare(b.day))),

  weakItems: (childId, limit) =>
    read((db) => {
      const map = new Map<string, WeakItem>();
      for (const a of db.attempts) {
        if (a.childId !== childId || !a.itemId || !a.firstTry) continue;
        const w = map.get(a.itemId) ?? { itemId: a.itemId, wrong: 0, total: 0 };
        w.total += 1;
        if (!a.isCorrect) w.wrong += 1;
        map.set(a.itemId, w);
      }
      return [...map.values()].filter((w) => w.wrong > 0).sort((a, b) => b.wrong / b.total - a.wrong / a.total).slice(0, limit);
    }),

  startConversation: (childId, _courseId, mode) =>
    tx((db) => {
      const id = randomUUID();
      db.conversations.push({ id, childId, mode, startedAt: new Date().toISOString() });
      return id;
    }),
  addTurn: (t) => tx((db) => void db.turns.push({ ...t, at: new Date().toISOString() })),
  finishConversation: (id, childId) =>
    tx((db) => {
      const c = db.conversations.find((x) => x.id === id && x.childId === childId);
      if (c) c.endedAt = new Date().toISOString();
    }),
  talkStats: (childId, since) =>
    read((db) => {
      const turns = db.turns.filter((t) => t.childId === childId && t.speaker === "child" && t.at.slice(0, 10) >= since);
      const lat = turns.map((t) => t.latencyMs).filter((x): x is number => typeof x === "number");
      const hinted = turns.filter((t) => typeof t.hintLevel === "number");
      return {
        childTurns: turns.length,
        avgLatencyMs: lat.length ? Math.round(lat.reduce((a, b) => a + b, 0) / lat.length) : null,
        unaidedRatio: hinted.length ? hinted.filter((t) => t.hintLevel === 0).length / hinted.length : null,
      } satisfies TalkStats;
    }),
};

export async function readDemoAvatar(rel: string): Promise<Buffer | null> {
  const safe = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
  try {
    return await readFile(path.join(DIR, "avatars", safe));
  } catch {
    return null;
  }
}
