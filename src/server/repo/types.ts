import type { Day } from "@/core/date";
import type { ProgressRow } from "@/core/session/build";

export type Parent = { id: string; displayName: string | null; hasPin: boolean; timezone: string };

export type Child = {
  id: string;
  parentId: string;
  nickname: string;
  avatarPath: string | null;
  costumeId: string;
  voiceAccent: string;
  /** "rotate" hoặc ID giọng (VOICE_CATALOG). */
  voice: string;
  dailyGoalMin: number;
};

export type SessionKind = "station" | "review" | "challenge" | "talk";

export type AttemptInput = {
  sessionId: string;
  childId: string;
  courseId: string;
  progressCourseId: string;
  itemId: string | null;
  exercise: string;
  isCorrect: boolean;
  firstTry: boolean;
  score: number;
  response: unknown;
  latencyMs: number | null;
  /** Trạng thái ôn mới (đã tính bằng SRS); null khi không cập nhật lịch ôn. */
  next: { box: number; dueOn: Day } | null;
};

export type FinishInput = {
  sessionId: string;
  childId: string;
  stars: number;
  firstTryCorrect: number;
  total: number;
  seconds: number;
  spoken: number;
  day: Day;
  station?: { courseId: string; unitId: string; stationId: string };
};

export type TurnInput = {
  conversationId: string;
  childId: string;
  speaker: "child" | "bot";
  text: string;
  expectedItemId?: string | null;
  score?: number | null;
  latencyMs?: number | null;
  hintLevel?: number | null;
};

export type StationRecord = { unitId: string; stationId: string; bestStars: number };
export type ActivityRecord = { day: Day; seconds: number; sessionsCount: number; spokenCount: number };
export type WeakItem = { itemId: string; wrong: number; total: number };
export type TalkStats = { childTurns: number; avgLatencyMs: number | null; unaidedRatio: number | null };

/**
 * Lớp truy cập dữ liệu. Có hai bản: Supabase (thật) và Demo (file JSON cục bộ,
 * dùng khi chưa cấu hình Supabase). Mọi hàm đều nhận `parentId` hoặc `childId`
 * đã được xác thực ở lớp auth.
 */
export interface Repo {
  readonly mode: "supabase" | "demo";
  getParent(parentId: string): Promise<Parent>;
  setPin(parentId: string, pinHash: string): Promise<void>;
  getPinHash(parentId: string): Promise<string | null>;

  listChildren(parentId: string): Promise<Child[]>;
  getChild(parentId: string, childId: string): Promise<Child | null>;
  createChild(parentId: string, nickname: string): Promise<Child>;
  updateChild(parentId: string, childId: string, patch: Partial<Pick<Child, "nickname" | "costumeId" | "dailyGoalMin" | "avatarPath" | "voice">>): Promise<void>;

  saveAvatar(parentId: string, childId: string, webp: Uint8Array): Promise<string>;
  deleteAvatar(parentId: string, childId: string): Promise<void>;
  avatarUrl(path: string): Promise<string | null>;

  getProgress(childId: string, progressCourseId: string): Promise<ProgressRow[]>;
  getStations(childId: string, courseId: string): Promise<StationRecord[]>;

  startSession(childId: string, courseId: string, kind: SessionKind, unitId?: string, stationId?: string): Promise<string>;
  recordAttempt(input: AttemptInput): Promise<void>;
  finishSession(input: FinishInput): Promise<void>;

  getActivity(childId: string, sinceDay: Day): Promise<ActivityRecord[]>;
  weakItems(childId: string, limit: number): Promise<WeakItem[]>;

  startConversation(childId: string, courseId: string, mode: "quick" | "roleplay" | "ai", dialogueId: string | null, round: number): Promise<string>;
  addTurn(input: TurnInput): Promise<void>;
  finishConversation(conversationId: string, childId: string): Promise<void>;
  talkStats(childId: string, sinceDay: Day): Promise<TalkStats>;
}
