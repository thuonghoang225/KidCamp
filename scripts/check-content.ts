// Kiểm tra toàn bộ nội dung học (chạy trong CI): schema, ID từ, hình minh họa.
import { existsSync } from "node:fs";
import path from "node:path";
import { courses, dialogues, findPattern } from "../content/courses";
import { lexicon } from "../content/english/lexicon";
import { assetMap } from "../content/assets";

const problems: string[] = [];
for (const course of courses.values()) {
  for (const unit of course.units) {
    for (const id of unit.words) if (!lexicon.has(id)) problems.push(`${course.id}/${unit.id}: thiếu từ ${id}`);
    for (const p of unit.patterns)
      for (const ids of Object.values(p.slots)) for (const id of ids) if (!lexicon.has(id)) problems.push(`${p.id}: slot trỏ tới từ không có ${id}`);
  }
}
for (const w of lexicon.values()) if (!assetMap.has(w.image)) problems.push(`${w.id}: thiếu hình ${w.image}`);
for (const a of assetMap.values()) if (!existsSync(path.join(process.cwd(), "public", a.file))) problems.push(`thiếu file ${a.file} (chạy pnpm assets:sync)`);
for (const d of dialogues) for (const t of d.turns) if (t.expectPattern && !findPattern(t.expectPattern)) problems.push(`${d.id}: mẫu câu không có ${t.expectPattern}`);

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Nội dung hợp lệ: ${courses.size} khóa, ${lexicon.size} từ, ${assetMap.size} hình`);
