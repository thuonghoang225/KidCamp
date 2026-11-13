import { NextResponse } from "next/server";
import { requireChild } from "@/server/auth/session";

/**
 * Nhận diện giọng nói trên máy chủ (Whisper qua API tương thích OpenAI, mặc định Groq).
 * Chính xác hơn nhiều so với nhận diện có sẵn của Safari/Chrome với giọng trẻ em, và không bị
 * iPad tự ngắt giữa câu. Chưa đặt GROQ_API_KEY thì app dùng nhận diện của trình duyệt như cũ.
 *
 * Biến môi trường:
 *   GROQ_API_KEY   bắt buộc để bật (gói miễn phí của Groq đủ cho gia đình)
 *   STT_BASE_URL   tùy chọn, mặc định https://api.groq.com/openai/v1 (đổi sang OpenAI… nếu muốn)
 *   STT_MODEL      tùy chọn, mặc định whisper-large-v3-turbo
 */
const BASE = process.env.STT_BASE_URL || "https://api.groq.com/openai/v1";
const MODEL = process.env.STT_MODEL || "whisper-large-v3-turbo";
const KEY = process.env.GROQ_API_KEY || process.env.STT_API_KEY;
const MAX_BYTES = 2 * 1024 * 1024; // ~ hơn 1 phút âm thanh nén, bé chỉ nói vài giây

/** Trình duyệt hỏi có nhận diện trên máy chủ không. */
export async function GET() {
  return NextResponse.json({ enabled: Boolean(KEY) }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  if (!KEY) return NextResponse.json({ error: "disabled" }, { status: 404 });
  await requireChild(); // chỉ bé đã đăng nhập mới dùng được (tránh người ngoài dùng ké key)

  const form = await req.formData();
  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) return NextResponse.json({ error: "no-audio" }, { status: 400 });
  if (audio.size > MAX_BYTES) return NextResponse.json({ error: "too-large" }, { status: 413 });

  // Gợi ý từ vựng cho Whisper: chỉ đưa TỪ trong các câu đúng (không đưa cả câu)
  // để máy nghe rõ tên riêng như "Viet Nam", "Malaysia" mà không tự "sửa" câu sai thành đúng.
  const vocab = String(form.get("vocab") ?? "").slice(0, 400);
  const prompt = `A Vietnamese child answers an English question in a short sentence.${vocab ? ` Words: ${vocab}.` : ""}`;

  const ext = audio.type.includes("mp4") || audio.type.includes("aac") ? "m4a" : audio.type.includes("ogg") ? "ogg" : "webm";
  const body = new FormData();
  body.append("file", audio, `answer.${ext}`);
  body.append("model", MODEL);
  body.append("language", "en");
  body.append("temperature", "0");
  body.append("response_format", "json");
  body.append("prompt", prompt);

  const res = await fetch(`${BASE}/audio/transcriptions`, { method: "POST", headers: { authorization: `Bearer ${KEY}` }, body });
  if (!res.ok) {
    console.error("[KidCamp] stt", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: res.status === 429 ? "busy" : "failed" }, { status: 502 });
  }
  const data = (await res.json()) as { text?: string };
  return NextResponse.json({ text: (data.text ?? "").trim() }, { headers: { "cache-control": "no-store" } });
}
