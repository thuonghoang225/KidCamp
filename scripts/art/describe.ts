/** Hình KidCamp tự vẽ: tính từ (Unit 8, 11, 13) và người trong gia đình. */
import { C, circle, frame, kid, line, moon, motion, note, path, rect, sparkle, star, sunIcon } from "./kit";

const ground = (y: number, fill = C.grass) => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="${fill}"/>`;
const road = (y: number) => `<rect x="-5" y="${y}" width="210" height="44" fill="#6b7680"/>` + Array.from({ length: 6 }, (_, i) => line(6 + i * 36, y + 22, 24 + i * 36, y + 22, 4, "#fff")).join("");
const car = (x: number, y: number, fill: string) =>
  path(`M${x} ${y} L${x} ${y - 14} Q${x + 2} ${y - 18} ${x + 10} ${y - 18} L${x + 14} ${y - 30} L${x + 40} ${y - 30} L${x + 48} ${y - 18} Q${x + 58} ${y - 18} ${x + 58} ${y - 10} L${x + 58} ${y}Z`, fill) +
  rect(x + 17, y - 26, 10, 9, "#bfe6ff", 2) + rect(x + 30, y - 26, 10, 9, "#bfe6ff", 2) + circle(x + 13, y, 7, C.line) + circle(x + 45, y, 7, C.line);
const house = (x: number, y: number, w: number, fill: string) =>
  rect(x, y, w, 52, fill, 2) + path(`M${x - 6} ${y + 2} L${x + w / 2} ${y - 26} L${x + w + 6} ${y + 2}Z`, C.red) + rect(x + w / 2 - 8, y + 26, 16, 26, C.woodDark, 2) + rect(x + 6, y + 10, 12, 12, "#bfe6ff", 2);
const tree = (x: number, y: number, r = 18) => rect(x - 4, y, 8, 30, C.woodDark, 2) + circle(x, y - 6, r, "#5cbf6a");
const bird = (x: number, y: number) => path(`M${x - 8} ${y} Q${x - 4} ${y - 6} ${x} ${y} Q${x + 4} ${y - 6} ${x + 8} ${y}`);
const ruler = (x: number, y1: number, y2: number) =>
  line(x, y1, x, y2, 4) + Array.from({ length: Math.floor((y2 - y1) / 12) + 1 }, (_, i) => line(x, y2 - i * 12, x + (i % 2 ? 6 : 11), y2 - i * 12, 2.5)).join("");
const arrow = (x: number, y1: number, y2: number, color = C.red) =>
  line(x, y1, x, y2, 5, color) + path(`M${x - 8} ${y2 + (y2 < y1 ? 10 : -10)} L${x} ${y2} L${x + 8} ${y2 + (y2 < y1 ? 10 : -10)}`, "none", `stroke="${color}" stroke-width="5"`);

export const describeArt: Record<string, () => string> = {
  /* ---------- Đường phố (Unit 11) ---------- */
  busy: () => frame(C.sky,
    house(8, 58, 46, "#f6e3c3") + house(70, 50, 54, "#ffd9b3") + house(140, 62, 50, "#e0ecff") + road(126) +
    car(4, 156, C.red) + car(74, 156, C.blue) + car(140, 160, C.sun) + `<rect x="-5" y="170" width="210" height="40" fill="#d4dde2"/>` +
    [24, 52, 96, 124, 168].map((x, i) => kid({ x, y: 166, scale: 0.4, shirt: [C.red, C.shirt, "#c05ad6", C.blue, "#f28c28"][i], legL: [-20], legR: [20], armL: [25], armR: [-25] }).svg).join("")),
  quiet: () => frame("#e6f3ff",
    moon(160, 36, 14) + tree(36, 110, 22) + house(76, 100, 60, "#f6e3c3") + tree(170, 112, 18) + `<rect x="-5" y="152" width="210" height="60" fill="#c9d3da"/>` +
    path("M-5 168 Q100 158 205 168", "none", `stroke="#fff" stroke-width="3" stroke-dasharray="10 10"`) +
    `<ellipse cx="150" cy="176" rx="14" ry="9" fill="#f2a65a" stroke="${C.line}" stroke-width="3"/>` + circle(162, 170, 7, "#f2a65a") + path("M158 164 L160 158 L163 164 M163 164 L166 158 L168 165", "#f2a65a") +
    `<text x="120" y="150" font-family="Arial" font-weight="900" font-size="16" fill="#8a9aa5">z z</text>` + bird(60, 40) + bird(80, 30)),
  noisy: () => {
    const k = kid({ x: 150, y: 150, armL: [160, 120], armR: [-160, -120], face: "o" });
    return frame("#fff3e6", road(150) + car(8, 182, C.red) + car(70, 176, C.blue) +
      `<g fill="${C.line}" font-family="Arial" font-weight="900" font-size="22"><text x="10" y="120">BEEP!</text><text x="70" y="70">HONK!</text></g>` +
      path("M60 136 l10 -8 M66 142 l14 -4 M130 120 l8 -10", "none", `stroke="#f06a3a" stroke-width="4"`) + k.svg);
  },
  beautiful: () => frame(C.sky,
    [C.red, "#f28c28", C.sun, C.shirt, C.blue, "#c05ad6"].map((c, i) => `<path d="M10 150 A90 90 0 0 1 190 150" fill="none" stroke="${c}" stroke-width="9" transform="translate(0 ${i * 9})" />`).join("") +
    ground(160) + [24, 60, 100, 140, 176].map((x, i) => line(x, 186, x, 164, 4, "#2f9e5b") + circle(x, 162, 9, [C.red, "#c05ad6", C.sun, "#f28c28", C.red][i]) + circle(x, 162, 4, C.sun)).join("") +
    sparkle(50, 40, 9, "#fff") + sparkle(150, 34, 7, "#fff") + sparkle(100, 60, 8, C.sun)),

  /* ---------- Ngoại hình (Unit 13) ---------- */
  tall: () => {
    const big = kid({ x: 90, y: 144, scale: 1.3, shirt: C.blue, pants: "#3a4a5c" });
    return frame("#eef7ff", ground(186, "#f1dcc0") + ruler(160, 30, 186) + big.svg + arrow(180, 160, 34));
  },
  short: () => {
    const k = kid({ x: 92, y: 146, scale: 0.72, shirt: "#f28c28", longHair: true });
    return frame("#fff3e6", ground(186, "#f1dcc0") + ruler(150, 30, 186) + line(70, 104, 140, 104, 3, C.red) + k.svg + arrow(176, 120, 172));
  },
  slim: () => {
    const k = kid({ x: 100, y: 144, width: 0.62, shirt: "#c05ad6", longHair: true, armL: [-6, -2], armR: [6, 2], legL: [-1, 0], legR: [1, 0] });
    return frame("#f5ecff", ground(186, "#f1dcc0") + path("M56 120 L72 112 L72 128Z", C.red) + path("M144 120 L128 112 L128 128Z", C.red) + k.svg);
  },
  big: () => {
    const k = kid({ x: 100, y: 146, scale: 1.25, width: 1.7, shirt: C.red, armL: [-40, -20], armR: [40, 20], legL: [-10, 0], legR: [10, 0] });
    return frame("#fff0ec", ground(186, "#f1dcc0") + k.svg);
  },
  young: () => {
    const baby = kid({ x: 100, y: 150, scale: 0.85, shirt: "#ffd0e0", pants: "#ffd0e0", armL: [-120, -150], armR: [120, 150], legL: [-60, 0], legR: [60, 0], face: "open", hairColor: "#c9a06a" });
    return frame("#fff0f6", ground(176, "#ffe6a6") + baby.svg + path("M150 120 L150 168", "none", `stroke="${C.red}" stroke-width="5"`) + circle(150, 112, 12, "#ffd0e0") + star(40, 50, 8) + star(160, 40, 6, "#ffd0e0"));
  },
  old: () => {
    const k = kid({ x: 92, y: 146, scale: 1.2, hairColor: "#e6e6e6", glasses: true, shirt: "#8c6d52", pants: "#5b6470", armR: [30, 10] });
    return frame("#f6f1ea", ground(186, "#f1dcc0") + k.svg + line(k.handR[0] + 2, k.handR[1], k.handR[0] + 8, 186, 6, C.woodDark) + path(`M${k.handR[0] - 4} ${k.handR[1] + 2} Q${k.handR[0]} ${k.handR[1] - 10} ${k.handR[0] + 6} ${k.handR[1]}`, "none", `stroke="${C.woodDark}" stroke-width="6"`));
  },

  /* ---------- Lý do (Unit 8) ---------- */
  fun: () => {
    const a = kid({ x: 64, y: 140, armL: [-150, -170], armR: [150, 170], face: "open", legL: [-30], legR: [30] });
    const b = kid({ x: 140, y: 140, armL: [-140, -160], armR: [140, 160], face: "open", longHair: true, shirt: "#c05ad6", legL: [-30], legR: [30] });
    return frame("#fff6dc", ground(186, "#f1dcc0") + [[30, 30, C.red], [100, 20, C.blue], [170, 40, C.shirt], [60, 60, C.sun], [150, 80, "#c05ad6"]].map(([x, y, c]) => rect(x as number, y as number, 8, 14, c as string, 2, `transform="rotate(30 ${x} ${y})"`)).join("") + a.svg + b.svg);
  },
  interesting: () => {
    const k = kid({ x: 100, y: 156, armL: [40, 100], armR: [-40, -100], face: "o" });
    return frame("#eef0ff", k.svg + path("M100 136 L68 128 L68 104 L100 112 L132 104 L132 128Z", C.white) + line(100, 112, 100, 136) + star(84, 118, 6) + star(116, 118, 6, C.red) +
      circle(68, 116, 5, C.skin) + circle(132, 116, 5, C.skin) + circle(100, 36, 16, C.sun) + rect(92, 50, 16, 12, C.grey, 3) +
      [-60, -30, 0, 30, 60].map((a) => { const r = (a * Math.PI) / 180; return line(100 + 22 * Math.sin(r), 36 - 22 * Math.cos(r), 100 + 32 * Math.sin(r), 36 - 32 * Math.cos(r), 4, "#f5b301"); }).join("") + sparkle(40, 60, 7, C.sun) + sparkle(162, 70, 7, C.sun));
  },
  easy: () => {
    const k = kid({ x: 64, y: 150, armR: [160, 175] });
    return frame("#eaf9ee", ground(186, "#f1dcc0") + k.svg + rect(k.handR[0] - 7, k.handR[1] - 16, 14, 18, C.skin, 6) +
      rect(104, 40, 84, 64, "#fff", 6) + `<text x="146" y="82" font-family="Arial" font-weight="900" font-size="26" text-anchor="middle" fill="${C.line}">1+1=2</text>` +
      `<path d="M120 132 L140 152 L178 110" fill="none" stroke="${C.shirt}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`);
  },

  /* ---------- Gia đình (Unit 13) ---------- */
  brother: () => {
    const big = kid({ x: 70, y: 140, scale: 1.12, shirt: C.blue, armR: [60, 40] });
    const me = kid({ x: 140, y: 150, scale: 0.88, shirt: C.shirt, armL: [-60, -40] });
    return frame("#e8f3ff", ground(186, "#f1dcc0") + big.svg + me.svg + path("M104 40 C96 28 80 36 92 50 L104 60 L116 50 C128 36 112 28 104 40Z", C.red));
  },
  sister: () => {
    const sis = kid({ x: 70, y: 140, scale: 1.08, shirt: "#c05ad6", longHair: true, armR: [60, 40] });
    const me = kid({ x: 140, y: 150, scale: 0.88, shirt: C.shirt, armL: [-60, -40] });
    return frame("#fbeeff", ground(186, "#f1dcc0") + sis.svg + me.svg + path("M104 40 C96 28 80 36 92 50 L104 60 L116 50 C128 36 112 28 104 40Z", C.red));
  },
};

void motion; void note; void sunIcon;
