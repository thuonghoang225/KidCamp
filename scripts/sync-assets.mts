// Chép / tải hình minh họa đã khai báo trong content/assets.ts vào public/img.
// - Cờ: từ gói npm flag-icons (MIT)
// - Emoji 3D: từ microsoft/fluentui-emoji (MIT) trên GitHub
// - Hình KidCamp tự vẽ (mặt đồng hồ, tranh minh họa từ vựng trong scripts/art): sinh SVG
// Chạy: pnpm assets:sync
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { assetDefs } from "../content/assets";
import { art } from "./art";

const root = path.resolve(import.meta.dirname, "..");
const out = (file: string) => path.join(root, "public", file);
const exists = (p: string) => access(p).then(() => true, () => false);

/** Mặt đồng hồ chỉ giờ chẵn, nét to rõ cho bé. */
function clockSvg(hour: number): string {
  const angle = ((hour % 12) / 12) * 2 * Math.PI;
  const hx = 100 + 44 * Math.sin(angle);
  const hy = 100 - 44 * Math.cos(angle);
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI;
    const r1 = i % 3 === 0 ? 70 : 76;
    return `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 84 * Math.sin(a)}" y2="${100 - 84 * Math.cos(a)}" stroke="#1f2a24" stroke-width="${i % 3 === 0 ? 7 : 4}" stroke-linecap="round"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="94" fill="#ffffff" stroke="#2b8fe0" stroke-width="10"/>${ticks}<line x1="100" y1="100" x2="${hx}" y2="${hy}" stroke="#1f2a24" stroke-width="10" stroke-linecap="round"/><line x1="100" y1="100" x2="100" y2="34" stroke="#f06a3a" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="#1f2a24"/></svg>`;
}

/** Thẻ số to, rõ (dùng cho How many…?). */
function numberSvg(n: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="8" y="8" width="184" height="184" rx="36" fill="#fff4cc" stroke="#f5b301" stroke-width="10"/><text x="100" y="134" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-size="104" font-weight="800" text-anchor="middle" fill="#1f2a24">${n}</text></svg>`;
}

for (const a of assetDefs) {
  const dest = out(a.file);
  await mkdir(path.dirname(dest), { recursive: true });
  const o = a.origin;
  const drawn = /^art-(.+)$/.exec(a.key);
  if (drawn) {
    // Hình tự vẽ: luôn vẽ lại để cập nhật khi sửa scripts/art
    const draw = art[drawn[1]];
    if (!draw) throw new Error(`Chưa có hình vẽ cho ${a.key} trong scripts/art`);
    await writeFile(dest, draw());
    continue;
  }
  if (await exists(dest)) continue;
  if (o.kind === "flag") {
    await copyFile(path.join(root, "node_modules/flag-icons/flags/1x1", `${o.code}.svg`), dest);
  } else if (o.kind === "kidcamp") {
    const clock = /^clock-(\d+)$/.exec(a.key);
    const num = /^num-(\d+)$/.exec(a.key);
    if (clock) await writeFile(dest, clockSvg(Number(clock[1])));
    else if (num) await writeFile(dest, numberSvg(Number(num[1])));
    else throw new Error(`Chưa biết cách vẽ hình ${a.key}`);
  } else {
    const slug = o.folder.toLowerCase().replaceAll(" ", "_");
    const rel = o.skinTone ? `Default/3D/${slug}_3d_default.png` : `3D/${slug}_3d.png`;
    const url = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${encodeURIComponent(o.folder)}/${rel}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Không tải được ${url}: ${res.status}`);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  }
  console.log("✓", a.key);
}
console.log("Xong: hình đã nằm trong public/img");
