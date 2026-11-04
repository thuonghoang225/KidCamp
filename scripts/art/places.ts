/** Hình KidCamp tự vẽ: nghề nghiệp, nơi chốn, buổi trong ngày, môn thể thao (Unit 9–15). */
import { C, circle, frame, kid, line, moon, motion, path, rect, sparkle, star, sunIcon } from "./kit";

const ground = (y: number, fill = C.grass) => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="${fill}"/>`;
const text = (x: number, y: number, s: string, size = 16, fill = C.line) =>
  `<text x="${x}" y="${y}" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}">${s}</text>`;
const win = (x: number, y: number, w = 14, h = 14) => rect(x, y, w, h, "#bfe6ff", 2);
const building = (x: number, y: number, w: number, h: number, fill: string, cols: number, rows: number) =>
  rect(x, y, w, h, fill, 3) +
  Array.from({ length: cols * rows }, (_, i) => win(x + 8 + (i % cols) * ((w - 16) / cols), y + 10 + Math.floor(i / cols) * 22, (w - 16) / cols - 6, 13)).join("");
const cross = (x: number, y: number, s = 14, fill = C.red) => rect(x - s / 3, y - s, (s * 2) / 3, s * 2, fill, 2) + rect(x - s, y - s / 3, s * 2, (s * 2) / 3, fill, 2);
const tree = (x: number, y: number, r = 18) => rect(x - 4, y, 8, 26, C.woodDark, 2) + circle(x, y - 6, r, "#5cbf6a");

export const placesArt: Record<string, () => string> = {
  /* ---------- Nhà (Unit 11) ---------- */
  house: () => frame(C.sky, sunIcon(166, 34, 13) + ground(160) +
    rect(40, 84, 120, 80, "#ffd9b3", 3) + path("M30 88 L100 30 L170 88Z", C.red) + rect(88, 118, 26, 46, C.woodDark, 3) + circle(108, 142, 2.5, C.sun) +
    rect(52, 100, 26, 22, "#bfe6ff", 2) + rect(124, 100, 26, 22, "#bfe6ff", 2) + rect(132, 40, 14, 30, "#b55a3c", 2) + tree(184, 134, 14)),
  flat: () => frame(C.sky, ground(176, "#d4dde2") +
    building(46, 20, 108, 156, "#e9d8ff", 3, 6) + rect(86, 150, 28, 26, C.woodDark, 2) +
    [0, 1, 2, 3, 4, 5].map((r) => rect(46, 36 + r * 22, 108, 3, "#c9b7ee", 0, `stroke="none"`)).join("") + tree(24, 150, 14) + tree(178, 150, 14)),
  street: () => frame(C.sky,
    building(4, 60, 52, 100, "#ffd9b3", 2, 4) + building(62, 40, 60, 120, "#e0ecff", 2, 5) + building(130, 70, 66, 90, "#f6e3c3", 3, 3) +
    `<rect x="-5" y="158" width="210" height="50" fill="#6b7680"/>` + Array.from({ length: 6 }, (_, i) => line(6 + i * 36, 182, 24 + i * 36, 182, 4, "#fff")).join("") +
    line(186, 160, 186, 110, 4) + circle(186, 106, 6, C.sun)),
  village: () => frame("#e9f8e2", sunIcon(40, 34, 12) +
    path("M-5 110 Q60 70 120 104 T205 96 L205 205 L-5 205Z", "#a5dc8e") + ground(150, "#8fd17a") +
    path("M30 150 L30 124 L56 104 L82 124 L82 150Z", "#f6e3c3") + path("M24 128 L56 98 L88 128Z", "#d9a441") +
    path("M110 150 L110 128 L132 112 L154 128 L154 150Z", "#ffd9b3") + path("M104 132 L132 106 L160 132Z", "#d9a441") +
    tree(178, 130, 16) + path("M60 176 Q100 160 150 190", "none", `stroke="#e3c79a" stroke-width="12"`)),

  /* ---------- Nghề nghiệp (Unit 12) ---------- */
  teacher: () => {
    const k = kid({ x: 132, y: 146, scale: 1.12, longHair: true, glasses: true, shirt: "#c05ad6", armL: [-120, -110] });
    return frame("#eef7ff", rect(10, 30, 96, 70, "#2f5d4a", 4) + rect(4, 24, 108, 82, "none", 6, `stroke="${C.wood}" stroke-width="6"`) + text(58, 76, "A B C", 22, "#fff") +
      ground(186, "#f1dcc0") + k.svg + line(k.handL[0], k.handL[1], k.handL[0] - 22, k.handL[1] - 14, 4, C.woodDark));
  },
  doctor: () => {
    const k = kid({ x: 100, y: 146, scale: 1.12, shirt: "#ffffff", pants: "#4a6a8a" });
    return frame("#e8f8f4", ground(186, "#dfeaf0") + cross(36, 44, 14) + k.svg +
      path("M90 104 Q86 128 100 132 Q114 128 110 104", "none", `stroke="${C.line}" stroke-width="3.5"`) + circle(100, 134, 5, C.grey) + rect(106, 112, 10, 12, C.blue, 2));
  },
  nurse: () => {
    const k = kid({ x: 100, y: 146, scale: 1.1, longHair: true, shirt: "#7cc4f5", pants: "#7cc4f5", hat: "none" });
    return frame("#fff0f3", ground(186, "#dfeaf0") + k.svg + rect(84, 26, 32, 14, "#fff", 4) + cross(100, 33, 5) + cross(160, 60, 12, C.red) + rect(30, 120, 30, 40, "#fff", 4) + cross(45, 140, 7));
  },
  farmer: () => {
    const k = kid({ x: 80, y: 146, scale: 1.1, shirt: "#d9a441", pants: "#3f6fa0", hat: "none", armR: [40, 150] });
    return frame("#eaf8de", sunIcon(170, 30, 12) + ground(170, "#b98a55") + [0, 1, 2, 3].map((i) => path(`M${120 + i * 20} 170 q-6 -18 0 -26 q6 8 0 26`, "#5cbf6a")).join("") +
      k.svg + path("M50 54 L110 54 L96 40 L64 40Z", "#e8c46a") + line(k.handR[0], k.handR[1] + 30, k.handR[0], k.handR[1] - 40, 5, C.woodDark) + path(`M${k.handR[0] - 10} ${k.handR[1] - 40} L${k.handR[0] + 10} ${k.handR[1] - 40} L${k.handR[0] + 8} ${k.handR[1] - 58} L${k.handR[0] - 8} ${k.handR[1] - 58}Z`, C.grey));
  },
  driver: () => {
    const k = kid({ x: 92, y: 126, scale: 0.9, hat: "cap", armL: [120, 80], armR: [120, 80], noLegs: true });
    return frame(C.sky, `<rect x="-5" y="160" width="210" height="50" fill="#6b7680"/>` +
      path("M20 160 L20 120 Q22 112 34 112 L56 82 L150 82 L172 112 Q186 112 186 124 L186 160Z", C.sun) + rect(64, 90, 38, 24, "#bfe6ff", 3) + rect(108, 90, 38, 24, "#bfe6ff", 3) +
      `<g clip-path="none">${k.svg}</g>` + rect(80, 58, 44, 14, C.line, 3) + text(102, 69, "TAXI", 10, C.sun) + circle(52, 160, 14, C.line) + circle(152, 160, 14, C.line) + circle(52, 160, 5, C.grey) + circle(152, 160, 5, C.grey) +
      circle(130, 120, 10, "none", `stroke-width="4"`));
  },
  worker: () => {
    const k = kid({ x: 92, y: 146, scale: 1.1, shirt: "#f28c28", pants: "#3a4a5c", hat: "helmet", armR: [60, 120] });
    return frame("#fff6e6", ground(186, "#c9d1d6") + k.svg + path("M66 38 C64 14 120 14 118 38Z", C.sun) + line(60, 38, 124, 38, 5) +
      line(k.handR[0], k.handR[1], k.handR[0] + 24, k.handR[1] - 20, 6, C.woodDark) + rect(k.handR[0] + 14, k.handR[1] - 34, 22, 14, C.grey, 3) + rect(150, 150, 36, 36, C.wood, 2) + line(150, 168, 186, 168));
  },
  singer: () => {
    const k = kid({ x: 100, y: 146, scale: 1.1, longHair: true, shirt: "#e0427a", face: "sing", armR: [150, -60], armL: [-110, -130] });
    return frame("#2d3a6b", `<path d="M70 0 L130 0 L190 205 L10 205Z" fill="#fff6c9" opacity=".25"/>` + ground(186, "#5a4a7a") + star(36, 40, 7) + star(170, 50, 6) + k.svg +
      `<g transform="rotate(-25 ${k.handR[0]} ${k.handR[1]})">${rect(k.handR[0] - 4, k.handR[1] - 8, 8, 24, C.line, 3)}${circle(k.handR[0], k.handR[1] - 14, 8, C.grey)}</g>`);
  },
  hospital: () => frame(C.sky, ground(174, "#d4dde2") + building(30, 50, 140, 124, "#ffffff", 4, 4) + rect(78, 138, 44, 36, "#9fd3f5", 3) + line(100, 138, 100, 174) +
    rect(84, 22, 32, 32, "#fff", 4) + cross(100, 38, 11, C.red) + rect(30, 50, 140, 4, C.red, 0, `stroke="none"`)),
  factory: () => frame("#f4efe6", ground(174, "#c9d1d6") +
    path("M20 174 L20 100 L60 80 L60 100 L100 80 L100 100 L140 80 L140 100 L180 100 L180 174Z", "#c4b6a6") + rect(148, 40, 18, 62, C.red, 2) + rect(148, 54, 18, 8, "#fff", 0) +
    circle(160, 28, 10, "#d4dde2") + circle(176, 18, 8, "#d4dde2") + [0, 1, 2].map((i) => rect(34 + i * 44, 120, 28, 22, "#bfe6ff", 2)).join("") + rect(86, 148, 28, 26, C.woodDark, 2)),
  office: () => {
    const k = kid({ x: 132, y: 150, scale: 1.0, shirt: "#ffffff", armL: [60, 100], noLegs: true });
    return frame("#eef3f8", building(10, 16, 70, 160, "#c9dcef", 2, 7) + k.svg + line(124, 108, 132, 132, 6, C.blue) + rect(96, 150, 104, 10, C.wood, 3) +
      rect(100, 116, 44, 32, C.line, 4) + rect(104, 120, 36, 24, "#7cc4f5", 2) + rect(150, 132, 30, 18, C.woodDark, 3) + path("M158 132 L158 126 L172 126 L172 132", "none"));
  },

  /* ---------- Buổi trong ngày (Unit 14) ---------- */
  morning: () => frame("#ffe9c7", path("M-5 140 Q100 90 205 140 L205 205 L-5 205Z", "#8fd17a") + sunIcon(100, 112, 24) + path("M-5 140 Q100 90 205 140 L205 205 L-5 205Z", "#8fd17a") +
    path("M40 50 q10 -12 20 0 q10 -12 20 0", "none", `stroke="#f28c28" stroke-width="3"`) + kid({ x: 160, y: 156, scale: 0.55, armL: [-150, -170], armR: [150, 170], face: "open" }).svg),
  afternoon: () => frame("#bfe6ff", sunIcon(100, 50, 26) + ground(150) + tree(40, 128, 20) + kid({ x: 140, y: 160, scale: 0.6, legL: [-30], legR: [30], armL: [30], armR: [-30] }).svg + circle(176, 182, 9, C.white)),
  evening: () => frame("#5b4a8c", path("M-5 0 L205 0 L205 120 L-5 120Z", "#f28c6a", `stroke="none" opacity=".55"`) + moon(150, 46, 18) + star(50, 34, 6) + star(96, 60, 4) +
    ground(150, "#3d5a4a") + rect(30, 100, 70, 52, "#f6e3c3", 3) + path("M22 104 L65 70 L108 104Z", C.red) + rect(42, 114, 18, 16, "#ffe680", 2) + rect(72, 114, 18, 16, "#ffe680", 2)),

  /* ---------- Nơi chốn cuối tuần (Unit 10, 15) ---------- */
  cinema: () => frame("#2d3a6b", rect(14, 20, 172, 96, "#ffffff", 4) + sunIcon(60, 64, 12) + path("M20 110 Q80 70 180 110Z", "#8fd17a") +
    [0, 1, 2, 3].map((i) => circle(30 + i * 46, 150, 18, "#e0427a") + circle(30 + i * 46, 176, 22, "#c4365f")).join("") +
    path("M136 110 L148 160 L176 160 L188 110Z", "#fff") + path("M140 120 L184 120", "none", `stroke="${C.red}" stroke-width="6"`) + circle(150, 104, 7, "#fff6c9") + circle(166, 102, 7, "#fff6c9") + circle(176, 108, 6, "#fff6c9")),
  supermarket: () => frame(C.sky, ground(178, "#d4dde2") + rect(14, 40, 172, 110, "#fff4e0", 4) + path("M10 40 L190 40 L184 60 L16 60Z", C.red) +
    [0, 1, 2, 3, 4, 5].map((i) => path(`M${16 + i * 28} 60 q14 14 28 0`, i % 2 ? C.white : C.red)).join("") + rect(30, 84, 140, 6, C.woodDark, 2) +
    circle(46, 76, 7, C.red) + circle(64, 76, 7, "#f28c28") + circle(84, 76, 7, C.sun) + rect(104, 66, 14, 18, C.blue, 2) + rect(124, 66, 14, 18, C.shirt, 2) + rect(144, 70, 18, 14, "#fff", 2) +
    path("M60 120 L70 120 L80 160 L140 160 L150 128 L74 128", "none", `stroke-width="4"`) + circle(88, 170, 6, C.line) + circle(134, 170, 6, C.line) + rect(84, 134, 56, 22, "#f28c28", 3, `opacity=".9"`)),
  "swimming-pool": () => frame("#e6f6ff", rect(-5, 90, 210, 120, "#f2f2f2", 0) + rect(14, 104, 172, 84, C.water, 8) +
    [0, 1, 2].map((i) => line(14, 128 + i * 20, 186, 128 + i * 20, 3, i === 1 ? C.red : "#fff")).join("") +
    line(160, 70, 160, 120, 5, C.grey) + line(178, 70, 178, 120, 5, C.grey) + line(160, 88, 178, 88, 4, C.grey) + line(160, 104, 178, 104, 4, C.grey) + sunIcon(40, 42, 14)),
  bookshop: () => frame("#fff8e6", rect(14, 46, 172, 140, "#ffffff", 4) + path("M8 46 L192 46 L186 66 L14 66Z", C.shirt) + text(100, 62, "BOOKS", 15, "#fff") +
    rect(24, 78, 152, 100, "#bfe6ff", 3) + [0, 1].map((r) => rect(30, 118 + r * 40, 140, 6, C.woodDark, 2) +
      Array.from({ length: 10 }, (_, i) => rect(34 + i * 13.5, 90 + r * 40 + (i % 3) * 4, 11, 28 - (i % 3) * 4, [C.red, C.blue, C.sun, "#c05ad6", "#f28c28"][(i + r) % 5], 2)).join("")).join("")),
  "sports-centre": () => frame(C.sky, ground(170) +
    path("M10 170 L10 90 Q100 40 190 90 L190 170Z", "#e0ecff") + path("M10 90 Q100 40 190 90", "none", `stroke="${C.blue}" stroke-width="8"`) +
    rect(80, 124, 40, 46, "#9fd3f5", 3) + line(100, 124, 100, 170) + circle(46, 116, 13, "#f28c28") + path("M33 116 L59 116 M46 103 L46 129", "none") +
    circle(154, 116, 13, C.white) + path("M148 104 Q160 116 148 128 M160 104 Q148 116 160 128", "none")),

  /* ---------- Môn thể thao (Unit 9) ---------- */
  badminton: () => {
    const k = kid({ x: 84, y: 146, armR: [150, 175], armL: [-40, -20], look: 4 });
    return frame(C.sky, ground(186, "#8fd17a") + k.svg + line(k.handR[0], k.handR[1], k.handR[0] + 8, k.handR[1] - 26, 4) + `<ellipse cx="${k.handR[0] + 12}" cy="${k.handR[1] - 40}" rx="11" ry="15" fill="#fff" stroke="${C.line}" stroke-width="3"/>` +
      path("M160 52 L150 70 L170 70Z", "#fff") + circle(160, 74, 5, C.red) + motion(150, 90, 2, 14));
  },
  "table-tennis": () => {
    const k = kid({ x: 46, y: 140, armR: [110, 80], look: 4, noLegs: false });
    return frame("#eef6ff", ground(186, "#f1dcc0") + rect(60, 128, 140, 10, "#22824a", 2) + line(130, 108, 130, 128, 3) + line(130, 108, 136, 108, 3) +
      rect(70, 138, 6, 48, C.line, 1) + rect(186, 138, 6, 48, C.line, 1) + k.svg + circle(k.handR[0] + 8, k.handR[1] - 6, 10, C.red) + line(k.handR[0], k.handR[1], k.handR[0] + 4, k.handR[1] - 2, 5, C.woodDark) + circle(150, 90, 5, "#fff"));
  },
  basketball: () => {
    const k = kid({ x: 70, y: 146, armL: [-160, -170], armR: [160, 170], legL: [-10], legR: [10], look: 4 });
    return frame("#fff3e6", ground(186, "#e8b67a") + rect(132, 24, 56, 40, "#fff", 3) + rect(148, 38, 24, 18, "none", 2) +
      `<ellipse cx="160" cy="66" rx="16" ry="4" fill="none" stroke="#f06a3a" stroke-width="4"/>` + path("M146 68 L150 88 M174 68 L170 88 M160 70 L160 90", "none", `stroke="#bbb" stroke-width="2"`) +
      line(188, 64, 188, 186, 6, C.grey) + k.svg + circle(70, 50, 15, "#f28c28") + path("M55 50 L85 50 M70 35 L70 65", "none"));
  },
  volleyball: () => {
    const k = kid({ x: 60, y: 146, armL: [-160, -170], armR: [160, 170], look: 4, longHair: true, shirt: C.blue });
    return frame("#fff7e0", ground(176, "#f3d79a") + line(126, 80, 126, 186, 4) + rect(126, 80, 0, 0, "none") +
      Array.from({ length: 6 }, (_, i) => line(126, 82 + i * 8, 200, 82 + i * 8, 1.5, C.line)).join("") + line(126, 80, 205, 80, 4) + k.svg +
      circle(62, 50, 15, "#fff") + path("M50 42 Q62 52 74 42 M52 60 Q60 48 62 36 M70 62 Q66 52 74 46", "none", `stroke-width="2.5"`) + sunIcon(176, 32, 12));
  },
  "sports-day": () => frame(C.sky, ground(150, "#8fd17a") + `<rect x="-5" y="150" width="210" height="60" fill="#e8a87c"/>` + line(-5, 168, 205, 168, 3, "#fff") + line(-5, 186, 205, 186, 3, "#fff") +
    path("M20 20 L180 20", "none") + [C.red, C.sun, C.blue, C.shirt, "#c05ad6", "#f28c28", C.red, C.sun].map((c, i) => path(`M${24 + i * 20} 20 L${34 + i * 20} 38 L${44 + i * 20} 20Z`, c, `stroke-width="2"`)).join("") +
    rect(62, 80, 76, 64, C.sun, 4) + rect(76, 60, 48, 22, C.sun, 4) + text(100, 120, "1", 30) + circle(100, 58, 0, "none") + kid({ x: 100, y: 60, scale: 0.5, armL: [-150, -170], armR: [150, 170], face: "open" }).svg),
};

void sparkle;
