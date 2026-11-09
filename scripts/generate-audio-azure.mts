// Tạo file âm thanh bằng Azure Speech (giọng Neural), chạy song song với giọng Kokoro.
//
// Chuẩn bị (một lần):
//   1. Tạo tài nguyên "Speech" trên portal.azure.com, chọn gói Free F0 (miễn phí 0,5 triệu ký tự/tháng).
//   2. Thêm vào .env.local:  AZURE_SPEECH_KEY=...   AZURE_SPEECH_REGION=southeastasia
// Chạy:
//   pnpm audio:list
//   pnpm audio:azure                 # mặc định giọng Ana (bé gái)
//   pnpm audio:azure jenny guy       # chọn giọng khác: ana, jenny, aria, guy
//
// Chỉ tạo file còn thiếu; gói F0 giới hạn số lượt mỗi phút nên script tự chờ khi bị báo 429.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { VOICE_CATALOG } from "../src/subjects/english/speech/audio-key";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "public", "audio");

// Đọc .env.local (không cần thêm thư viện)
for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = /^\s*([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;
if (!key || !region) {
  console.error("Thiếu AZURE_SPEECH_KEY hoặc AZURE_SPEECH_REGION trong .env.local (xem README, mục Giọng đọc Azure).");
  process.exit(1);
}

const wanted = (process.argv.slice(2).length ? process.argv.slice(2) : ["ana"]).map((n) => `azure-${n.replace(/^azure-/, "")}`);
const voices = VOICE_CATALOG.filter((v) => v.provider === "azure" && wanted.includes(v.id));
if (voices.length !== wanted.length) {
  console.error(`Giọng không hợp lệ. Chọn trong: ${VOICE_CATALOG.filter((v) => v.provider === "azure").map((v) => v.id.slice(6)).join(", ")}`);
  process.exit(1);
}

const listPath = path.join(root, ".data", "speech.json");
if (!existsSync(listPath)) {
  console.error("Chưa có .data/speech.json. Chạy: pnpm audio:list");
  process.exit(1);
}
const items: Array<{ key: string; text: string; ipa?: string }> = JSON.parse(readFileSync(listPath, "utf8"));

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function synth(text: string, voice: string, ipa?: string): Promise<Buffer> {
  // Âm đứng riêng: mẫu "âm – nghỉ – âm" đọc chậm (giống script Kokoro). Dấu "…" là chỗ bé tự nói: đọc thành một nhịp nghỉ
  const ph = ipa && `<phoneme alphabet="ipa" ph="ˈ${xml(ipa)}">a</phoneme>`;
  const body = ph
    ? `<prosody rate="-35%">${ph}<break time="600ms"/>${ph}</prosody>`
    : xml(text.replace(/…/g, ","));
  const ssml = `<speak version="1.0" xml:lang="en-US"><voice name="${voice}">${body}</voice></speak>`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key!,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "KidCamp",
      },
      body: ssml,
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 5000 * (attempt + 1);
      process.stdout.write(`  (Azure bận, chờ ${Math.round(wait / 1000)} giây)\n`);
      await sleep(wait);
      continue;
    }
    throw new Error(`Azure trả lỗi ${res.status}: ${await res.text()}`);
  }
}

let made = 0;
for (const v of voices) {
  const dir = path.join(out, v.id);
  mkdirSync(dir, { recursive: true });
  const todo = items.filter((it) => !existsSync(path.join(dir, `${it.key}.mp3`)));
  console.log(`${v.label}: cần tạo ${todo.length}/${items.length} câu`);
  for (const [i, it] of todo.entries()) {
    writeFileSync(path.join(dir, `${it.key}.mp3`), await synth(it.text, v.engineVoice, it.ipa));
    made++;
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${todo.length}`);
  }
}

// Cập nhật manifest: giọng nào đủ file thì app cho chọn
const keys = items.map((it) => it.key).sort();
const ready = readdirSync(out, { withFileTypes: true })
  .filter((d) => d.isDirectory() && keys.every((k) => existsSync(path.join(out, d.name, `${k}.mp3`))))
  .map((d) => d.name)
  .sort();
writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ voices: ready, keys }));
console.log(`Xong: tạo mới ${made} file. Giọng sẵn sàng: ${ready.join(", ")}`);
