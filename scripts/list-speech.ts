// Liệt kê mọi câu tiếng Anh app có thể đọc, để tạo file âm thanh.
// Chạy: pnpm exec tsx scripts/list-speech.ts > .data/speech.json
import { fillSlots } from "../content/schema";
import { courses, dialogues } from "../content/courses";
import { lexicon } from "../content/english/lexicon";
import { getWord } from "../content/english/lexicon";
import { FALLBACK_DISTRACTORS } from "../src/core/exercises/generate";
import { SYSTEM_PHRASES, audioKey } from "../src/subjects/english/speech/audio-key";

const texts = new Set<string>(SYSTEM_PHRASES);
const add = (t?: string) => t && t.trim() && texts.add(t.trim().replace(/\s+/g, " "));

for (const w of lexicon.values()) {
  add(w.text);
  add(w.example);
}
for (const course of courses.values()) {
  for (const unit of course.units) {
    for (const p of unit.patterns) {
      const slot = Object.keys(p.slots)[0];
      if (!slot) {
        add(p.question);
        add(p.answer);
      } else {
        for (const id of p.slots[slot]) {
          const v = { [slot]: getWord(id).text };
          add(fillSlots(p.question, v));
          add(fillSlots(p.answer, v));
        }
      }
      for (const alt of p.acceptAlso.filter((a) => !a.includes("{"))) add(alt);
    }
    for (const set of unit.phonics) [...set.target, ...set.others].forEach(add);
    for (const l of unit.chant?.lines ?? []) {
      add(l.text);
      if (l.gap) add(l.text.replace(l.gap, "…"));
    }
  }
}
for (const d of dialogues) for (const t of d.turns) {
  add(t.say);
  add(t.hints[0]);
}

FALLBACK_DISTRACTORS.forEach((t) => add(t));

const list = [...texts].sort().map((text) => ({ key: audioKey(text), text }));
const dup = new Map<string, string>();
for (const { key, text } of list) {
  if (dup.has(key) && dup.get(key) !== text) throw new Error(`Trùng khóa âm thanh: "${text}" và "${dup.get(key)}"`);
  dup.set(key, text);
}
process.stdout.write(JSON.stringify(list, null, 1));
