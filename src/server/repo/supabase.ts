import "server-only";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { ProgressRow } from "@/core/session/build";
import type { Child, Repo, WeakItem } from "./types";

/**
 * Bản Supabase: mọi truy vấn chạy bằng phiên của phụ huynh, nên Row Level Security
 * trong database đảm bảo mỗi gia đình chỉ thấy dữ liệu của mình.
 */

type ChildRow = {
  id: string; parent_id: string; nickname: string; avatar_path: string | null;
  costume_id: string; voice_accent: string; voice: string | null; daily_goal_min: number;
};

const toChild = (r: ChildRow): Child => ({
  id: r.id, parentId: r.parent_id, nickname: r.nickname, avatarPath: r.avatar_path,
  costumeId: r.costume_id, voiceAccent: r.voice_accent, voice: r.voice ?? "rotate", dailyGoalMin: r.daily_goal_min,
});

/** Ném lỗi nếu truy vấn lỗi. Với `maybeSingle()` kết quả vẫn có thể là null — luôn kiểm tra trước khi dùng. */
// Chưa sinh kiểu từ schema (`supabase gen types`) nên hàng trả về là `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function check<T = any>(res: { data: unknown; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const sb = createSupabaseServer;

type ProgressDb = { item_id: string; box: number; due_on: string | null; correct_count: number; wrong_count: number };
type StationDb = { unit_id: string; station_id: string; best_stars: number };
type ActivityDb = { day: string; seconds: number; sessions_count: number; spoken_count: number };
type TurnStatDb = { latency_ms: number | null; hint_level: number | null };

export const supabaseRepo: Repo = {
  mode: "supabase",

  async getParent(parentId) {
    const db = await sb();
    const row = check(await db.from("parents").select("id, display_name, pin_hash, timezone").eq("id", parentId).maybeSingle());
    if (!row) {
      check(await db.from("parents").insert({ id: parentId }));
      return { id: parentId, displayName: null, hasPin: false, timezone: "Asia/Ho_Chi_Minh" };
    }
    return { id: row.id, displayName: row.display_name, hasPin: !!row.pin_hash, timezone: row.timezone };
  },
  async setPin(parentId, pinHash) {
    check(await (await sb()).from("parents").update({ pin_hash: pinHash }).eq("id", parentId));
  },
  async getPinHash(parentId) {
    const row = check(await (await sb()).from("parents").select("pin_hash").eq("id", parentId).maybeSingle());
    return row?.pin_hash ?? null;
  },

  async listChildren(parentId) {
    const rows = check(await (await sb()).from("children").select("*").eq("parent_id", parentId).order("created_at"));
    return (rows as ChildRow[]).map(toChild);
  },
  async getChild(parentId, childId) {
    const row = check(await (await sb()).from("children").select("*").eq("parent_id", parentId).eq("id", childId).maybeSingle());
    return row ? toChild(row as ChildRow) : null;
  },
  async createChild(parentId, nickname) {
    const db = await sb();
    const row = check(await db.from("children").insert({ parent_id: parentId, nickname }).select("*").single()) as ChildRow;
    check(await db.from("enrollments").insert({ child_id: row.id, course_id: "en-g4" }));
    return toChild(row);
  },
  async updateChild(parentId, childId, patch) {
    const update: Record<string, unknown> = {};
    if (patch.nickname !== undefined) update.nickname = patch.nickname;
    if (patch.costumeId !== undefined) update.costume_id = patch.costumeId;
    if (patch.dailyGoalMin !== undefined) update.daily_goal_min = patch.dailyGoalMin;
    if (patch.avatarPath !== undefined) update.avatar_path = patch.avatarPath;
    if (patch.voice !== undefined) update.voice = patch.voice;
    check(await (await sb()).from("children").update(update).eq("id", childId).eq("parent_id", parentId));
  },

  async saveAvatar(parentId, childId, webp) {
    const db = await sb();
    const path = `${parentId}/${childId}/face.webp`;
    const { error } = await db.storage.from("avatars").upload(path, webp, { contentType: "image/webp", upsert: true });
    if (error) throw new Error(error.message);
    await this.updateChild(parentId, childId, { avatarPath: path });
    return path;
  },
  async deleteAvatar(parentId, childId) {
    const db = await sb();
    await db.storage.from("avatars").remove([`${parentId}/${childId}/face.webp`]);
    await this.updateChild(parentId, childId, { avatarPath: null });
  },
  async avatarUrl(path) {
    const { data } = await (await sb()).storage.from("avatars").createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  },

  async getProgress(childId, courseId) {
    const rows = check<ProgressDb[]>(
      await (await sb()).from("item_progress").select("item_id, box, due_on, correct_count, wrong_count").eq("child_id", childId).eq("course_id", courseId),
    );
    return rows.map(
      (r): ProgressRow => ({ itemId: r.item_id, box: r.box, dueOn: r.due_on, correctCount: r.correct_count, wrongCount: r.wrong_count }),
    );
  },
  async getStations(childId, courseId) {
    const rows = check<StationDb[]>(await (await sb()).from("station_progress").select("unit_id, station_id, best_stars").eq("child_id", childId).eq("course_id", courseId));
    return rows.map((r) => ({ unitId: r.unit_id, stationId: r.station_id, bestStars: r.best_stars }));
  },

  async startSession(childId, courseId, kind, unitId, stationId) {
    const row = check(
      await (await sb()).from("sessions").insert({ child_id: childId, course_id: courseId, kind, unit_id: unitId, station_id: stationId }).select("id").single(),
    );
    return row.id as string;
  },
  async recordAttempt(a) {
    check(
      await (await sb()).rpc("record_attempt", {
        p_session_id: a.sessionId, p_child_id: a.childId, p_course_id: a.courseId, p_progress_course_id: a.progressCourseId,
        p_item_id: a.itemId, p_exercise: a.exercise, p_is_correct: a.isCorrect, p_first_try: a.firstTry, p_score: a.score,
        p_response: a.response, p_latency_ms: a.latencyMs, p_box: a.next?.box ?? null, p_due_on: a.next?.dueOn ?? null,
      }),
    );
  },
  async finishSession(f) {
    const db = await sb();
    const updated = check(
      await db.from("sessions")
        .update({ ended_at: new Date().toISOString(), stars: f.stars, first_try_correct: f.firstTryCorrect, total: f.total })
        .eq("id", f.sessionId).eq("child_id", f.childId).is("ended_at", null).select("id"),
    );
    if (updated.length === 0) return; // đã kết thúc trước đó
    const act = check(await db.from("daily_activity").select("*").eq("child_id", f.childId).eq("day", f.day).maybeSingle());
    check(
      await db.from("daily_activity").upsert({
        child_id: f.childId, day: f.day,
        seconds: (act?.seconds ?? 0) + f.seconds,
        sessions_count: (act?.sessions_count ?? 0) + 1,
        spoken_count: (act?.spoken_count ?? 0) + f.spoken,
      }),
    );
    if (f.station) {
      const prev = check(
        await db.from("station_progress").select("best_stars").eq("child_id", f.childId).eq("course_id", f.station.courseId)
          .eq("unit_id", f.station.unitId).eq("station_id", f.station.stationId).maybeSingle(),
      );
      check(
        await db.from("station_progress").upsert({
          child_id: f.childId, course_id: f.station.courseId, unit_id: f.station.unitId, station_id: f.station.stationId,
          best_stars: Math.max(prev?.best_stars ?? 0, f.stars),
        }),
      );
    }
  },

  async getActivity(childId, since) {
    const rows = check<ActivityDb[]>(await (await sb()).from("daily_activity").select("*").eq("child_id", childId).gte("day", since).order("day"));
    return rows.map((r) => ({ day: r.day, seconds: r.seconds, sessionsCount: r.sessions_count, spokenCount: r.spoken_count }));
  },
  async weakItems(childId, limit) {
    const rows = check(
      await (await sb()).from("attempts").select("item_id, is_correct").eq("child_id", childId).eq("first_try", true)
        .not("item_id", "is", null).order("created_at", { ascending: false }).limit(500),
    );
    const map = new Map<string, WeakItem>();
    for (const r of rows) {
      const w = map.get(r.item_id) ?? { itemId: r.item_id, wrong: 0, total: 0 };
      w.total += 1;
      if (!r.is_correct) w.wrong += 1;
      map.set(r.item_id, w);
    }
    return [...map.values()].filter((w) => w.wrong > 0).sort((a, b) => b.wrong / b.total - a.wrong / a.total).slice(0, limit);
  },

  async startConversation(childId, courseId, mode, dialogueId, round) {
    const row = check(
      await (await sb()).from("conversations").insert({ child_id: childId, course_id: courseId, mode, dialogue_id: dialogueId, round }).select("id").single(),
    );
    return row.id as string;
  },
  async addTurn(t) {
    check(
      await (await sb()).from("conversation_turns").insert({
        conversation_id: t.conversationId, child_id: t.childId, speaker: t.speaker, text: t.text,
        expected_item_id: t.expectedItemId ?? null, score: t.score ?? null, latency_ms: t.latencyMs ?? null, hint_level: t.hintLevel ?? null,
      }),
    );
  },
  async finishConversation(id, childId) {
    check(await (await sb()).from("conversations").update({ ended_at: new Date().toISOString() }).eq("id", id).eq("child_id", childId));
  },
  async talkStats(childId, since) {
    const rows = check<TurnStatDb[]>(
      await (await sb()).from("conversation_turns").select("latency_ms, hint_level").eq("child_id", childId).eq("speaker", "child").gte("created_at", since),
    );
    const lat = rows.map((r) => r.latency_ms).filter((x): x is number => typeof x === "number");
    const hinted = rows.filter((r) => typeof r.hint_level === "number");
    return {
      childTurns: rows.length,
      avgLatencyMs: lat.length ? Math.round(lat.reduce((a, b) => a + b, 0) / lat.length) : null,
      unaidedRatio: hinted.length ? hinted.filter((r) => r.hint_level === 0).length / hinted.length : null,
    };
  },
};
