/** Hình KidCamp tự vẽ: môn học và phòng học (Unit 6–8). */
import { C, circle, frame, kid, line, note, path, rect, sparkle, star, sunIcon } from "./kit";

const floor = (y: number, fill = "#f1dcc0") => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="${fill}"/>`;
const text = (x: number, y: number, s: string, size = 30, fill = "#fff", anchor = "middle") =>
  `<text x="${x}" y="${y}" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="900" font-size="${size}" text-anchor="${anchor}" fill="${fill}">${s}</text>`;
const board = (x: number, y: number, w: number, h: number, inner: string) => rect(x - 6, y - 6, w + 12, h + 12, C.wood, 6) + rect(x, y, w, h, "#2f5d4a", 3) + inner;
const book = (x: number, y: number, w: number, h: number, fill: string, label = "") =>
  rect(x, y, w, h, fill, 5) + rect(x + w - 8, y, 8, h, "rgba(0,0,0,.18)", 3) + (label ? text(x + (w - 8) / 2, y + h / 2 + 9, label, 24) : "");
const monitor = (x: number, y: number, w = 56, screen = "#7cc4f5", inner = "") =>
  rect(x, y, w, w * 0.7, C.line, 5) + rect(x + 5, y + 5, w - 10, w * 0.7 - 10, screen, 2) + inner + rect(x + w / 2 - 5, y + w * 0.7, 10, 10, C.grey, 0) + rect(x + w / 2 - 16, y + w * 0.7 + 9, 32, 6, C.grey, 3);
const shelf = (x: number, y: number, w: number) =>
  rect(x, y, w, 8, C.woodDark, 2) +
  Array.from({ length: Math.floor(w / 13) }, (_, i) => rect(x + 3 + i * 13, y - 30 + (i % 3) * 4, 11, 30 - (i % 3) * 4, [C.red, C.blue, C.shirt, C.sun, "#c05ad6"][i % 5], 2)).join("");
const flower = (x: number, y: number, color: string) =>
  line(x, y, x, y + 30, 4, "#2f9e5b") + [0, 72, 144, 216, 288].map((a) => {
    const dx = 9 * Math.sin((a * Math.PI) / 180), dy = 9 * Math.cos((a * Math.PI) / 180);
    return circle(x + dx, y - dy, 7, color);
  }).join("") + circle(x, y, 6, C.sun);
const piano = (x: number, y: number) =>
  rect(x, y, 90, 50, C.line, 6) + rect(x + 6, y + 22, 78, 24, "#fff", 2) +
  Array.from({ length: 6 }, (_, i) => line(x + 19 + i * 13, y + 22, x + 19 + i * 13, y + 46, 2)).join("") +
  [0, 1, 3, 4].map((i) => rect(x + 15 + i * 13, y + 22, 8, 14, C.line, 1)).join("");

export const schoolArt: Record<string, () => string> = {
  /* ---------- Môn học ---------- */
  maths: () => frame("#e8f6ff",
    board(24, 24, 152, 92, text(100, 64, "2 + 3", 32) + text(100, 102, "= 5", 32, C.sun)) +
    rect(30, 140, 140, 18, C.sun, 3) + Array.from({ length: 13 }, (_, i) => line(38 + i * 10, 140, 38 + i * 10, i % 2 ? 148 : 152, 2)).join("") +
    path("M40 186 L60 166 L80 186Z", C.red) + circle(150, 178, 12, C.blue) + rect(96, 168, 22, 22, C.shirt, 3)),
  english: () => frame("#fff0f0",
    book(28, 58, 96, 116, C.red, "ABC") + path("M112 28 L186 28 Q194 28 194 36 L194 74 Q194 82 186 82 L146 82 L132 98 L134 82 L120 82 Q112 82 112 74 L112 36 Q112 28 120 28Z", C.white) +
    text(153, 64, "Hello!", 20, C.line) + `<g transform="translate(140 118)">${rect(0, 0, 50, 34, "#fff", 3)}${rect(0, 0, 50, 34, "none", 3)}${line(0, 17, 50, 17, 6, C.red)}${line(25, 0, 25, 34, 6, C.red)}${rect(0, 0, 22, 15, "#2f4a9e", 0)}</g>`),
  vietnamese: () => frame("#fff8e1",
    book(26, 40, 100, 130, "#2f9e5b", "") + text(68, 100, "Tiếng", 22) + text(68, 128, "Việt", 26) +
    `<g transform="translate(138 34)">${rect(0, 0, 50, 34, C.red, 3)}${star(25, 17, 10, C.sun)}</g>` +
    rect(140, 96, 40, 76, "#fff", 4) + text(160, 124, "a ă", 16, C.line) + text(160, 150, "â b", 16, C.line) +
    path("M150 178 L178 150 L184 156 L156 184 L148 186Z", C.sun)),
  science: () => frame("#eef9f0",
    path("M76 30 L76 84 L44 160 Q40 176 58 176 L122 176 Q140 176 136 160 L104 84 L104 30Z", "#ffffff") +
    path("M60 124 L120 124 L136 160 Q140 176 122 176 L58 176 Q40 176 44 160Z", "#7fdc8a") + rect(70, 24, 40, 10, C.grey, 3) +
    circle(80, 150, 6, "#fff") + circle(98, 160, 4, "#fff") + circle(92, 104, 5, "#fff", `opacity=".8"`) + circle(98, 80, 3.5, "#fff") +
    circle(158, 74, 22, "#d6f0ff", `stroke-width="6"`) + line(174, 90, 192, 112, 9) + sparkle(30, 50, 8, C.sun)),
  art: () => frame("#fff4f0",
    path("M30 120 C10 70 70 30 120 46 C170 60 180 110 150 130 C130 144 120 120 100 136 C80 150 46 160 30 120Z", "#f6dfb0") +
    circle(58, 82, 10, C.red) + circle(88, 64, 10, C.sun) + circle(124, 72, 10, C.blue) + circle(146, 102, 10, C.shirt) + circle(60, 118, 10, "#c05ad6") + circle(106, 112, 9, "#fff") +
    line(120, 186, 176, 120, 9, C.woodDark) + path("M172 116 L190 96 L196 104 L180 124Z", C.line) + path("M182 106 L196 92 Q200 100 192 108Z", C.red)),
  music: () => frame("#eef0ff",
    [C.red, "#f28c28", C.sun, C.shirt, C.blue, "#c05ad6"].map((c, i) => rect(30 + i * 24, 100 + i * 4, 18, 70 - i * 8, c, 4) + circle(39 + i * 24, 108 + i * 4, 2.5, "#fff") + circle(39 + i * 24, 162 - i * 4, 2.5, "#fff")).join("") +
    line(150, 120, 182, 92, 5, C.woodDark) + circle(184, 90, 7, C.white) + note(46, 64, C.red) + note(96, 44, C.blue) + note(140, 64, "#c05ad6")),
  pe: () => {
    const k = kid({ x: 92, y: 148, armL: [-140, -160], armR: [140, 160], legL: [-30, -20], legR: [30, 20], shirt: "#fff", pants: C.red, face: "open" });
    return frame("#e6f7e9", floor(178, C.grass) + k.svg + circle(160, 168, 14, "#f28c28") + path("M146 168 L174 168 M160 154 L160 182", "none") +
      path("M24 56 L46 56 L50 70 Q36 80 22 70Z", C.grey) + line(46, 60, 58, 56, 4) + line(24, 56, 18, 40, 3, C.red));
  },
  it: () => frame("#eaf2ff",
    monitor(36, 36, 108, "#3b3f6b", star(66, 70, 8) + rect(84, 66, 34, 6, "#8fd17a", 3) + rect(84, 80, 24, 6, "#7cc4f5", 3) + rect(56, 92, 50, 6, C.sun, 3) +
      path("M110 96 L110 116 L115 111 L120 120 L124 118 L119 109 L126 109Z", "#fff")) +
    rect(28, 168, 100, 20, C.grey, 5) + Array.from({ length: 6 }, (_, i) => rect(34 + i * 15, 172, 11, 6, "#fff", 1)).join("") +
    `<ellipse cx="156" cy="176" rx="14" ry="18" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + line(156, 160, 156, 172, 2.5)),

  /* ---------- Phòng học, sân trường ---------- */
  playground: () => frame(C.sky,
    sunIcon(170, 30, 12) + `<rect x="-5" y="168" width="210" height="40" fill="${C.grass}"/>` +
    line(24, 168, 24, 90, 6, C.red) + line(60, 168, 60, 90, 6, C.red) + rect(18, 86, 48, 10, C.red, 3) + Array.from({ length: 5 }, (_, i) => line(24, 100 + i * 14, 60, 100 + i * 14, 4)).join("") +
    path("M60 92 Q100 110 130 168", "none", `stroke="${C.sun}" stroke-width="16"`) + path("M60 92 Q100 110 130 168", "none", `stroke="${C.line}" stroke-width="3" transform="translate(0 -8)"`) +
    line(150, 168, 164, 80, 5, C.blue) + line(194, 168, 180, 80, 5, C.blue) + line(160, 82, 184, 82, 6, C.blue) + line(166, 82, 166, 140, 2) + line(178, 82, 178, 140, 2) + rect(160, 138, 24, 7, C.woodDark, 2)),
  library: () => {
    const k = kid({ x: 150, y: 150, armL: [40, 100], armR: [-40, -100], look: -3 });
    return frame("#fff8e6", floor(180) + rect(14, 20, 110, 160, C.wood, 4) + shelf(20, 64, 98) + shelf(20, 112, 98) + shelf(20, 160, 98) +
      k.svg + path("M150 132 L124 126 L124 106 L150 112 L176 106 L176 126Z", C.white) + line(150, 112, 150, 132) + circle(124, 116, 5, C.skin) + circle(176, 116, 5, C.skin));
  },
  "computer-room": () => frame("#eaf2ff", floor(150, "#dfe6ee") +
    [0, 1, 2].map((i) => monitor(10 + i * 64, 70, 52)).join("") + rect(4, 118, 192, 10, C.wood, 3) +
    [0, 1, 2].map((i) => rect(18 + i * 64, 132, 36, 34, C.blue, 8) + rect(26 + i * 64, 166, 6, 20, C.line, 2)).join("") + path("M30 30 L170 30", "none", `stroke="#cfd8e3" stroke-width="10"`)),
  "music-room": () => frame("#f1ecff", floor(170) + piano(14, 96) + line(36, 146, 36, 172, 6) + line(94, 146, 94, 172, 6) +
    `<ellipse cx="156" cy="132" rx="30" ry="10" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + path("M126 132 L126 168 Q156 182 186 168 L186 132", C.red) + `<ellipse cx="156" cy="132" rx="30" ry="10" fill="#fff" stroke="${C.line}" stroke-width="3"/>` +
    line(140, 110, 150, 126, 4, C.woodDark) + line(176, 108, 164, 126, 4, C.woodDark) + note(40, 54, C.red) + note(120, 40, C.blue) + note(170, 70)),
  "art-room": () => {
    const easel = (x: number, pic: string) => line(x + 6, 60, x - 6, 180, 5, C.woodDark) + line(x + 54, 60, x + 66, 180, 5, C.woodDark) + rect(x - 4, 40, 68, 66, "#fff", 3) + pic;
    return frame("#fff4f0", floor(176) + easel(18, sunIcon(40, 62, 8) + path("M20 100 Q40 76 60 100Z", "#8fd17a")) + easel(112, flower(146, 66, C.red)) +
      [C.red, C.blue, C.sun].map((c, i) => rect(70 + i * 22, 160, 18, 20, c, 3)).join(""));
  },
  gym: () => frame("#fff3e6", `<rect x="-5" y="160" width="210" height="45" fill="#e8b67a"/>` + line(-5, 172, 205, 172, 2, "#fff") +
    rect(120, 20, 64, 44, "#fff", 3) + rect(140, 40, 24, 18, "none", 2) + line(152, 64, 152, 70) + `<ellipse cx="152" cy="72" rx="14" ry="4" fill="none" stroke="#f06a3a" stroke-width="4"/>` +
    path("M140 74 L144 94 M164 74 L160 94 M152 76 L152 96", "none", `stroke="#bbb" stroke-width="2"`) + circle(60, 146, 16, "#f28c28") + path("M44 146 L76 146 M60 130 L60 162", "none") +
    rect(16, 162, 80, 14, C.blue, 5) + line(120, 120, 196, 120, 6, C.woodDark) + line(132, 124, 132, 160, 5, C.woodDark) + line(184, 124, 184, 160, 5, C.woodDark)),
  garden: () => frame(C.sky, sunIcon(36, 34, 13) + `<rect x="-5" y="150" width="210" height="60" fill="${C.grass}"/>` +
    rect(140, 70, 16, 84, C.woodDark, 4) + circle(148, 64, 34, "#5cbf6a") + circle(126, 80, 20, "#5cbf6a") + circle(170, 82, 20, "#5cbf6a") +
    flower(30, 128, C.red) + flower(64, 120, "#c05ad6") + flower(98, 130, C.sun) + path("M170 170 L196 170 L192 192 L174 192Z", C.blue) + line(176, 172, 160, 158, 5, C.blue)),
};
