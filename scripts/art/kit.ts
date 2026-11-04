/**
 * Bộ vẽ SVG đơn giản cho hình minh họa KidCamp tự vẽ.
 * Nhân vật bé là thiết kế riêng của KidCamp (tóc nâu, áo xanh lá), vẽ nét đậm để
 * nhìn rõ ở kích thước nhỏ trên iPad.
 */

/**
 * Bảng màu minh họa. Các màu đánh dấu "brand" phải trùng token trong src/app/globals.css;
 * các màu còn lại (da, tóc, gỗ, đỏ, đêm...) là màu riêng cho tranh, không dùng cho giao diện.
 * Kiểm tra: node scripts/snap-art-colors.mjs public/img/kidcamp
 */
export const C = {
  line: "#2a2320",
  skin: "#f8cfa8",
  cheek: "#f59a8b",
  hair: "#5a3620",
  shirt: "#2f9e5b", // brand forest-500
  pants: "#1f78c4", // brand sky-600
  white: "#ffffff",
  sun: "#ffc933", // brand sun-400
  sky: "#e3f2ff", // brand sky-100
  night: "#2d3a6b",
  wood: "#c98b52",
  woodDark: "#9c6534",
  red: "#ef5a4c",
  blue: "#2b8fe0", // brand sky-500
  water: "#5fb8f0",
  grass: "#8fd17a",
  grey: "#c9d1d6",
};

export const W = 3; // độ dày viền

const r2 = (n: number) => Math.round(n * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Điểm cuối của đoạn dài `len`, góc `deg` tính từ hướng thẳng xuống, dương = sang phải. */
export function step(x: number, y: number, len: number, deg: number): [number, number] {
  return [r2(x + len * Math.sin(rad(deg))), r2(y + len * Math.cos(rad(deg)))];
}

/** Một chi (tay/chân) gồm các đoạn nối tiếp; trả về SVG và điểm cuối. */
export function limb(x: number, y: number, segs: Array<[number, number]>, color: string, width: number) {
  const pts: Array<[number, number]> = [[x, y]];
  for (const [len, deg] of segs) pts.push(step(...pts.at(-1)!, len, deg));
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const svg =
    `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${width + W * 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return { svg, end: pts.at(-1)! };
}

/** Ghép thuộc tính mặc định với `extra` ("k=\"v\" …"); `extra` ghi đè, tránh thuộc tính trùng (SVG lỗi khi mở bằng <img>). */
function attrs(defaults: Record<string, string | number>, extra: string): string {
  const merged: Record<string, string | number> = { ...defaults };
  for (const m of extra.matchAll(/([\w:-]+)="([^"]*)"/g)) merged[m[1]] = m[2];
  return Object.entries(merged).map(([k, v]) => `${k}="${v}"`).join(" ");
}
export const circle = (cx: number, cy: number, r: number, fill: string, extra = "") =>
  `<circle ${attrs({ cx, cy, r, fill, stroke: C.line, "stroke-width": W }, extra)}/>`;
export const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 6, extra = "") =>
  `<rect ${attrs({ x, y, width: w, height: h, rx, fill, stroke: C.line, "stroke-width": W }, extra)}/>`;
export const path = (d: string, fill = "none", extra = "") =>
  `<path ${attrs({ d, fill, stroke: C.line, "stroke-width": W, "stroke-linecap": "round", "stroke-linejoin": "round" }, extra)}/>`;
export const line = (x1: number, y1: number, x2: number, y2: number, width = W, color = C.line) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;

export const note = (x: number, y: number, color = C.line) =>
  `<g fill="${color}" stroke="${color}"><ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" transform="rotate(-20 ${x} ${y})"/><line x1="${x + 5}" y1="${y - 1}" x2="${x + 5}" y2="${y - 20}" stroke-width="3" stroke-linecap="round"/><path d="M${x + 5} ${y - 20} q8 3 9 10" fill="none" stroke-width="3" stroke-linecap="round"/></g>`;
export const star = (x: number, y: number, r: number, fill = C.sun) => {
  const pts = Array.from({ length: 10 }, (_, i) => step(x, y, i % 2 ? r * 0.45 : r, 180 + i * 36)).map((p) => p.join(",")).join(" ");
  return `<polygon points="${pts}" fill="${fill}" stroke="${C.line}" stroke-width="2.5" stroke-linejoin="round"/>`;
};
export const sparkle = (x: number, y: number, s = 8, color = C.white) =>
  `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="${color}" stroke="${C.line}" stroke-width="2"/>`;
export const sunIcon = (x: number, y: number, r = 16) =>
  Array.from({ length: 8 }, (_, i) => {
    const [a, b] = step(x, y, r + 5, i * 45);
    const [c, d] = step(x, y, r + 12, i * 45);
    return line(a, b, c, d, 4, "#f5b301");
  }).join("") + circle(x, y, r, C.sun);
export const moon = (x: number, y: number, r = 14) =>
  `<path d="M${x + r * 0.4} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.4} ${y + r} A${r * 0.8} ${r * 0.8} 0 1 1 ${x + r * 0.4} ${y - r}Z" fill="#ffe680" stroke="${C.line}" stroke-width="2.5"/>`;
export const motion = (x: number, y: number, n = 3, len = 22) =>
  Array.from({ length: n }, (_, i) => line(x - (i % 2) * 6, y + i * 12, x - len - (i % 2) * 6, y + i * 12, 4, "#8a9aa5")).join("");
/** Đồng hồ treo tường nhỏ chỉ giờ chẵn. */
export const wallClock = (x: number, y: number, hour: number, r = 15) => {
  const [hx, hy] = step(x, y, r * 0.5, 180 + (hour % 12) * 30);
  return circle(x, y, r, C.white) + line(x, y, hx, hy, 3.5) + line(x, y, x, y - r * 0.75, 2.5, C.red) + `<circle cx="${x}" cy="${y}" r="2.5" fill="${C.line}"/>`;
};

export type Arm = Array<[number, number]>;
export type KidOpts = {
  /** Hông (gốc của chân). */
  x: number;
  y: number;
  armL?: number[];
  armR?: number[];
  legL?: number[];
  legR?: number[];
  face?: "smile" | "open" | "o" | "closed" | "sing" | "think";
  /** Lệch mắt (nhìn sang trái/phải). */
  look?: number;
  hat?: "none" | "cap" | "helmet" | "chef" | "swimcap";
  shirt?: string;
  pants?: string;
  /** Vẽ thêm phía sau thân (ba lô…). */
  behind?: string;
  /** Không vẽ chân (bị chăn/bàn che). */
  noLegs?: boolean;
  shoes?: "normal" | "skates" | "none";
  headphones?: boolean;
  goggles?: boolean;
  hairColor?: string;
  /** Tóc dài (bạn nữ). */
  longHair?: boolean;
  glasses?: boolean;
  /** Phóng to/thu nhỏ quanh bàn chân (người lớn, em bé). */
  scale?: number;
  /** Co chiều ngang thân (gầy) hoặc giãn (to). */
  width?: number;
};

/** Độ dài: cánh tay 2 đoạn 18, chân 2 đoạn 22. Góc mặc định: tay buông, chân đứng thẳng. */
export function kid(o: KidOpts): { svg: string; handL: [number, number]; handR: [number, number]; footL: [number, number]; footR: [number, number]; head: [number, number] } {
  const { x, y } = o;
  const shirt = o.shirt ?? C.shirt;
  const pants = o.pants ?? C.pants;
  const segs = (a: number[] | undefined, def: number[], len: number): Arm => (a ?? def).map((d) => [len, d] as [number, number]);
  const legL = limb(x - 7, y - 4, segs(o.legL, [-4, 0], 22), pants, 11);
  const legR = limb(x + 7, y - 4, segs(o.legR, [4, 0], 22), pants, 11);
  const armL = limb(x - 13, y - 36, segs(o.armL, [-20, -8], 17), shirt, 9);
  const armR = limb(x + 13, y - 36, segs(o.armR, [20, 8], 17), shirt, 9);
  const shoe = (p: [number, number]) =>
    o.shoes === "none"
      ? circle(p[0], p[1], 5, C.skin)
      : o.shoes === "skates"
        ? `<g>${rect(p[0] - 9, p[1] - 5, 20, 10, C.red, 4)}${circle(p[0] - 5, p[1] + 8, 4, C.white)}${circle(p[0] + 7, p[1] + 8, 4, C.white)}</g>`
        : `<ellipse cx="${p[0] + 2}" cy="${p[1] + 1}" rx="8" ry="5" fill="${C.line}"/>`;
  const hand = (p: [number, number]) => circle(p[0], p[1], 5, C.skin);
  const hx = x, hy = y - 62;
  const lk = o.look ?? 0;
  const face = o.face ?? "smile";
  const eyes =
    face === "closed" || face === "sing"
      ? path(`M${hx - 10 + lk} ${hy} q3 3 6 0`) + path(`M${hx + 4 + lk} ${hy} q3 3 6 0`)
      : `<circle cx="${hx - 7 + lk}" cy="${hy}" r="3" fill="${C.line}"/><circle cx="${hx + 7 + lk}" cy="${hy}" r="3" fill="${C.line}"/>` +
        `<circle cx="${hx - 6 + lk}" cy="${hy - 1}" r="1" fill="#fff"/><circle cx="${hx + 8 + lk}" cy="${hy - 1}" r="1" fill="#fff"/>`;
  const mouth =
    face === "open" || face === "sing"
      ? `<ellipse cx="${hx + lk / 2}" cy="${hy + 10}" rx="5" ry="${face === "sing" ? 6 : 4.5}" fill="#9b2c2c" stroke="${C.line}" stroke-width="2.5"/>`
      : face === "o"
        ? `<circle cx="${hx + lk / 2}" cy="${hy + 10}" r="3.5" fill="#9b2c2c" stroke="${C.line}" stroke-width="2"/>`
        : face === "think"
          ? path(`M${hx - 4} ${hy + 10} L${hx + 5} ${hy + 8}`)
          : path(`M${hx - 6 + lk / 2} ${hy + 8} Q${hx + lk / 2} ${hy + 14} ${hx + 6 + lk / 2} ${hy + 8}`);
  const cheeks = `<circle cx="${hx - 12}" cy="${hy + 6}" r="3.5" fill="${C.cheek}" opacity=".6"/><circle cx="${hx + 12}" cy="${hy + 6}" r="3.5" fill="${C.cheek}" opacity=".6"/>`;
  const hairFill = o.hairColor ?? C.hair;
  const longHair = o.longHair ? `<path d="M${hx - 21} ${hy - 4} C${hx - 30} ${hy + 20} ${hx - 26} ${hy + 30} ${hx - 14} ${hy + 30} L${hx - 14} ${hy + 4}Z M${hx + 21} ${hy - 4} C${hx + 30} ${hy + 20} ${hx + 26} ${hy + 30} ${hx + 14} ${hy + 30} L${hx + 14} ${hy + 4}Z" fill="${hairFill}" stroke="${C.line}" stroke-width="${W}" stroke-linejoin="round"/>` : "";
  const hair = `<path d="M${hx - 20} ${hy + 1} C${hx - 24} ${hy - 30} ${hx + 24} ${hy - 30} ${hx + 20} ${hy + 1} C${hx + 14} ${hy - 9} ${hx + 2} ${hy - 13} ${hx - 6} ${hy - 9} C${hx - 12} ${hy - 6} ${hx - 17} ${hy - 4} ${hx - 20} ${hy + 1}Z" fill="${hairFill}" stroke="${C.line}" stroke-width="${W}" stroke-linejoin="round"/>`;
  const hats: Record<string, string> = {
    none: "",
    cap: path(`M${hx - 20} ${hy - 6} C${hx - 20} ${hy - 28} ${hx + 20} ${hy - 28} ${hx + 20} ${hy - 6}Z`, C.red) + path(`M${hx + 10} ${hy - 7} L${hx + 32} ${hy - 4} L${hx + 18} ${hy - 9}Z`, C.red),
    helmet: path(`M${hx - 22} ${hy - 2} C${hx - 24} ${hy - 32} ${hx + 24} ${hy - 32} ${hx + 22} ${hy - 2}Z`, C.blue) + line(hx - 8, hy - 24, hx - 4, hy - 8, 3, "#fff") + line(hx + 8, hy - 24, hx + 4, hy - 8, 3, "#fff"),
    chef: path(`M${hx - 16} ${hy - 12} L${hx - 16} ${hy - 22} C${hx - 30} ${hy - 26} ${hx - 22} ${hy - 46} ${hx - 8} ${hy - 40} C${hx - 4} ${hy - 52} ${hx + 12} ${hy - 50} ${hx + 12} ${hy - 40} C${hx + 28} ${hy - 44} ${hx + 30} ${hy - 24} ${hx + 16} ${hy - 22} L${hx + 16} ${hy - 12}Z`, C.white),
    swimcap: path(`M${hx - 20} ${hy - 2} C${hx - 22} ${hy - 30} ${hx + 22} ${hy - 30} ${hx + 20} ${hy - 2} C${hx + 10} ${hy - 8} ${hx - 10} ${hy - 8} ${hx - 20} ${hy - 2}Z`, C.red),
  };
  const hat = o.hat ?? "none";
  const goggles = o.goggles
    ? line(hx - 20, hy - 2, hx + 20, hy - 2, 4, C.blue) + circle(hx - 7, hy - 1, 6, "#bfe6ff") + circle(hx + 7, hy - 1, 6, "#bfe6ff")
    : "";
  const phones = o.headphones
    ? path(`M${hx - 21} ${hy + 2} C${hx - 24} ${hy - 34} ${hx + 24} ${hy - 34} ${hx + 21} ${hy + 2}`, "none", `stroke-width="6"`) +
      rect(hx - 27, hy - 6, 10, 18, C.red, 5) + rect(hx + 17, hy - 6, 10, 18, C.red, 5)
    : "";
  const specs = o.glasses ? circle(hx - 7, hy, 6, "none", `stroke-width="2.5"`) + circle(hx + 7, hy, 6, "none", `stroke-width="2.5"`) + line(hx - 1, hy, hx + 1, hy, 2.5) : "";
  const head =
    longHair + circle(hx - 19, hy + 2, 5, C.skin) + circle(hx + 19, hy + 2, 5, C.skin) + circle(hx, hy, 20, C.skin) +
    (hat === "swimcap" || hat === "helmet" ? "" : hair) + hats[hat] + cheeks + (o.goggles ? goggles : eyes) + specs + mouth + phones;
  const bw = 32 * (o.width ?? 1);
  const body = rect(x - bw / 2, y - 44, bw, 44, shirt, 13);
  const legs = o.noLegs ? "" : legL.svg + legR.svg + shoe(legL.end) + shoe(legR.end);
  let svg = (o.behind ?? "") + legs + body + armL.svg + armR.svg + hand(armL.end) + hand(armR.end) + head;
  const k = o.scale ?? 1;
  // Phóng quanh điểm chạm đất để nhân vật vẫn đứng trên nền
  const gy = y + 42;
  const at = (p: [number, number]): [number, number] => [r2(x + (p[0] - x) * k), r2(gy + (p[1] - gy) * k)];
  if (k !== 1) svg = `<g transform="translate(${x} ${gy}) scale(${k}) translate(${-x} ${-gy})">${svg}</g>`;
  return { svg, handL: at(armL.end), handR: at(armR.end), footL: at(legL.end), footR: at(legR.end), head: at([hx, hy]) };
}

export function frame(bg: string, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><clipPath id="k"><rect width="200" height="200" rx="36"/></clipPath></defs><g clip-path="url(#k)"><rect width="200" height="200" fill="${bg}"/>${inner}</g></svg>`;
}
