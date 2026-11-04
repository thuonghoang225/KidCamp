/** Hình KidCamp tự vẽ cho Unit 16–20: thời tiết, xe cộ, quần áo, trạng từ, trại hè. */
import { C, circle, frame, kid, line, motion, note, path, rect, sparkle, star, step, sunIcon } from "./kit";

const ground = (y: number, fill = C.grass) => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="${fill}"/>`;
const road = (y: number) => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="#6b7680"/>` + Array.from({ length: 6 }, (_, i) => line(6 + i * 36, y + 16, 24 + i * 36, y + 16, 4, "#fff")).join("");
const cloud = (x: number, y: number, s = 1, fill = "#ffffff") =>
  path(`M${x - 30 * s} ${y + 12 * s} Q${x - 42 * s} ${y + 12 * s} ${x - 40 * s} ${y} Q${x - 38 * s} ${y - 14 * s} ${x - 22 * s} ${y - 12 * s} Q${x - 16 * s} ${y - 30 * s} ${x + 2 * s} ${y - 26 * s} Q${x + 18 * s} ${y - 32 * s} ${x + 24 * s} ${y - 14 * s} Q${x + 42 * s} ${y - 14 * s} ${x + 40 * s} ${y + 4 * s} Q${x + 40 * s} ${y + 12 * s} ${x + 30 * s} ${y + 12 * s}Z`, fill);
const drop = (x: number, y: number) => path(`M${x} ${y} Q${x - 6} ${y + 10} ${x} ${y + 13} Q${x + 6} ${y + 10} ${x} ${y}Z`, C.water, `stroke-width="2"`);
const flake = (x: number, y: number, r = 7) =>
  [0, 60, 120].map((a) => { const [x1, y1] = step(x, y, r, a); const [x2, y2] = step(x, y, r, a + 180); return line(x1, y1, x2, y2, 2.5, "#7cc4f5"); }).join("");
const wheel = (x: number, y: number, r = 12) => circle(x, y, r, C.line) + circle(x, y, r * 0.4, C.grey);
const tree = (x: number, y: number, r = 18, fill = "#5cbf6a") => rect(x - 4, y, 8, 26, C.woodDark, 2) + circle(x, y - 6, r, fill);
const tent = (x: number, y: number, fill = "#f28c28") => path(`M${x - 44} ${y} L${x} ${y - 60} L${x + 44} ${y}Z`, fill) + path(`M${x} ${y - 60} L${x - 12} ${y} L${x + 12} ${y}Z`, "#b85c14");
const fire = (x: number, y: number) =>
  line(x - 22, y + 4, x + 22, y - 4, 7, C.woodDark) + line(x - 22, y - 4, x + 22, y + 4, 7, C.woodDark) +
  path(`M${x - 16} ${y - 2} Q${x - 20} ${y - 26} ${x - 4} ${y - 40} Q${x - 2} ${y - 26} ${x + 6} ${y - 30} Q${x + 20} ${y - 18} ${x + 14} ${y - 2}Z`, "#f2662e") +
  path(`M${x - 8} ${y - 2} Q${x - 10} ${y - 16} ${x} ${y - 24} Q${x + 10} ${y - 14} ${x + 6} ${y - 2}Z`, C.sun);
const nightSky = (moonX = 160) => `<circle cx="${moonX}" cy="36" r="13" fill="#ffe680" stroke="${C.line}" stroke-width="2.5"/>` + star(40, 30, 5) + star(100, 20, 4) + star(130, 54, 3.5);

export const moreArt: Record<string, () => string> = {
  /* ---------- Unit 16: thời tiết ---------- */
  sunny: () => frame("#fff4c9", sunIcon(100, 82, 34) + ground(160) + kid({ x: 150, y: 150, scale: 0.55, armL: [-150, -170], armR: [150, 170], face: "open", hat: "cap" }).svg),
  rainy: () => {
    const k = kid({ x: 100, y: 150, scale: 0.85, armR: [150, 175], shirt: C.sun });
    return frame("#cfdbe6", cloud(70, 44, 1.1, "#b9c6d2") + cloud(150, 52, 0.9, "#b9c6d2") + [30, 60, 140, 175, 40, 160].map((x, i) => drop(x, 80 + (i % 3) * 30)).join("") +
      ground(176, "#8fbf7a") + k.svg + line(k.handR[0], k.handR[1] + 2, k.handR[0], 60, 4) + path("M60 64 Q100 18 140 64Z", C.red) + path(`M${k.handR[0]} ${k.handR[1] + 2} q0 10 -8 10`, "none", `stroke-width="4"`));
  },
  cloudy: () => frame("#e3edf5", sunIcon(140, 56, 18) + cloud(80, 70, 1.4) + cloud(140, 110, 1.1, "#eef3f7") + ground(170, "#9bd58a")),
  windy: () => {
    const k = kid({ x: 64, y: 150, scale: 0.85, armR: [140, 160], look: 4 });
    return frame(C.sky, ground(176) + path("M10 50 Q60 36 110 50 Q130 56 126 70", "none", `stroke="#8a9aa5" stroke-width="4"`) + path("M20 80 Q70 70 120 82", "none", `stroke="#8a9aa5" stroke-width="4"`) +
      k.svg + path(`M${k.handR[0]} ${k.handR[1]} Q120 100 146 52`, "none", `stroke-width="2"`) + path("M146 52 L170 26 L194 50 L170 74Z", C.red) + line(146, 52, 194, 50, 2) + line(170, 26, 170, 74, 2) +
      path("M170 74 q-6 10 4 16 q-8 6 0 14", "none", `stroke="${C.blue}" stroke-width="3"`) + path("M150 150 q10 -16 24 -10 q-10 4 -6 12", "#5cbf6a"));
  },
  snowy: () => {
    const k = kid({ x: 120, y: 150, scale: 0.85, shirt: C.red, armL: [-60, -30], armR: [60, 30] });
    return frame("#dcecff", ground(170, "#ffffff") + [30, 70, 110, 150, 180, 50, 90, 160].map((x, i) => flake(x, 30 + (i % 4) * 24)).join("") +
      circle(50, 160, 22, "#fff") + circle(50, 124, 16, "#fff") + circle(45, 120, 2.5, C.line) + circle(55, 120, 2.5, C.line) + path("M50 126 L62 129 L50 131Z", "#f28c28") + k.svg +
      path(`M${k.head[0] - 20} ${k.head[1] - 6} C${k.head[0] - 20} ${k.head[1] - 34} ${k.head[0] + 20} ${k.head[1] - 34} ${k.head[0] + 20} ${k.head[1] - 6}Z`, C.blue) + circle(k.head[0], k.head[1] - 30, 6, "#fff"));
  },
  hot: () => {
    const k = kid({ x: 110, y: 150, scale: 0.9, shirt: "#fff", armL: [-30, 60], face: "open" });
    return frame("#ffe0c2", sunIcon(40, 40, 22) + ground(176, "#f3d79a") + k.svg + `<ellipse cx="${k.handL[0] + 4}" cy="${k.handL[1] - 6}" rx="12" ry="18" fill="${C.red}" stroke="${C.line}" stroke-width="3" transform="rotate(-20 ${k.handL[0]} ${k.handL[1]})"/>` +
      path("M140 70 q4 8 0 12 q-4 -4 0 -12Z", "#7cc4f5") + path("M84 74 q4 8 0 12 q-4 -4 0 -12Z", "#7cc4f5") + rect(160, 90, 14, 70, "#fff", 7) + rect(163, 120, 8, 38, C.red, 4) + circle(167, 164, 10, C.red));
  },
  cold: () => {
    const k = kid({ x: 100, y: 150, scale: 0.9, shirt: C.blue, armL: [30, 80], armR: [-30, -80], face: "o" });
    return frame("#dcecff", ground(176, "#ffffff") + flake(30, 40) + flake(170, 50) + flake(150, 100, 5) + k.svg +
      rect(k.head[0] - 24, k.head[1] + 14, 48, 10, C.red, 5) + path(`M${k.head[0] - 20} ${k.head[1] - 6} C${k.head[0] - 20} ${k.head[1] - 34} ${k.head[0] + 20} ${k.head[1] - 34} ${k.head[0] + 20} ${k.head[1] - 6}Z`, C.red) +
      rect(150, 88, 14, 70, "#fff", 7) + rect(153, 140, 8, 18, C.blue, 4) + circle(157, 164, 10, C.blue) + path("M60 70 l-8 -4 M60 80 l-10 0", "none", `stroke="#7cc4f5"`));
  },

  /* ---------- Unit 17: xe cộ, địa điểm ---------- */
  bus: () => frame(C.sky, road(160) + rect(20, 70, 160, 80, C.sun, 12) + [0, 1, 2, 3].map((i) => rect(32 + i * 36, 84, 28, 26, "#bfe6ff", 4)).join("") + rect(164, 84, 12, 50, "#bfe6ff", 3) +
    line(20, 124, 180, 124, 3) + wheel(56, 152, 14) + wheel(146, 152, 14) + rect(150, 60, 26, 12, C.line, 3) + `<text x="163" y="70" font-family="Arial" font-weight="900" font-size="9" text-anchor="middle" fill="${C.sun}">BUS</text>`),
  car: () => frame(C.sky, road(160) + path("M20 150 L20 122 Q22 114 34 112 L60 82 L136 82 L164 112 Q184 114 184 128 L184 150Z", C.red) + rect(70, 90, 30, 22, "#bfe6ff", 3) + rect(106, 90, 32, 22, "#bfe6ff", 3) + wheel(56, 152, 15) + wheel(150, 152, 15) + circle(178, 128, 5, C.sun)),
  bike: () => frame(C.sky, ground(176) + circle(56, 140, 30, "none", `stroke-width="6"`) + circle(148, 140, 30, "none", `stroke-width="6"`) +
    path("M56 140 L88 100 L136 100 L148 140 M88 100 L102 140 L136 100 M102 140 L56 140", "none", `stroke="${C.blue}" stroke-width="7"`) + line(136, 100, 142, 78, 5) + line(132, 76, 152, 76, 7) + line(80, 92, 98, 92, 9) + circle(102, 140, 7, C.grey)),
  motorbike: () => {
    const k = kid({ x: 96, y: 112, scale: 0.75, hat: "helmet", armL: [110, 90], armR: [110, 90], legL: [60, 10], legR: [60, 10], look: 4 });
    return frame(C.sky, road(170) + k.svg + path("M50 150 L70 120 L130 120 L150 150Z", "#2f8f5a") + line(130, 120, 146, 96, 6) + line(140, 94, 156, 94, 6) + wheel(52, 158, 18) + wheel(150, 158, 18) + rect(64, 112, 46, 10, C.line, 4) + motion(28, 120));
  },
  train: () => frame(C.sky, ground(170, "#c9b08a") + line(-5, 176, 205, 176, 4) + line(-5, 188, 205, 188, 4) +
    rect(14, 92, 70, 70, C.blue, 8) + rect(96, 92, 70, 70, C.blue, 8) + rect(150, 70, 44, 92, C.red, 8) + rect(158, 82, 28, 24, "#bfe6ff", 4) + rect(160, 54, 14, 18, C.line, 2) +
    [0, 1].map((i) => rect(24 + i * 82, 104, 22, 22, "#bfe6ff", 3) + rect(52 + i * 82, 104, 22, 22, "#bfe6ff", 3)).join("") + [36, 66, 118, 148, 176].map((x) => wheel(x, 166, 9)).join("") + circle(176, 40, 8, "#d4dde2") + circle(186, 26, 6, "#d4dde2")),
  "post-office": () => frame(C.sky, ground(170, "#d4dde2") + rect(24, 66, 152, 104, "#fff4e0", 3) + path("M14 70 L100 30 L186 70Z", C.red) + rect(84, 120, 32, 50, C.woodDark, 3) +
    rect(70, 80, 60, 32, "#fff", 4) + path("M70 80 L100 100 L130 80", "none") + rect(150, 120, 22, 50, C.red, 6) + rect(154, 128, 14, 4, C.line, 1)),
  "bus-stop": () => {
    const k = kid({ x: 120, y: 150, scale: 0.85, look: -3 });
    return frame(C.sky, ground(176, "#d4dde2") + line(40, 176, 40, 56, 5, C.grey) + circle(40, 46, 18, C.blue) + `<text x="40" y="51" font-family="Arial" font-weight="900" font-size="13" text-anchor="middle" fill="#fff">BUS</text>` +
      rect(70, 70, 120, 8, C.line, 3) + line(76, 78, 76, 176, 4) + line(184, 78, 184, 176, 4) + rect(84, 146, 92, 8, C.wood, 3) + k.svg);
  },

  /* ---------- Unit 18: quần áo ---------- */
  "t-shirt": () => frame("#eaf6ff", path("M60 50 L84 40 Q100 56 116 40 L140 50 L170 80 L150 100 L136 88 L136 168 L64 168 L64 88 L50 100 L30 80Z", C.shirt) + star(100, 110, 14)),
  hat: () => frame("#fff4dc", `<ellipse cx="100" cy="134" rx="80" ry="22" fill="#e8c46a" stroke="${C.line}" stroke-width="3"/>` + path("M56 132 Q54 70 100 66 Q146 70 144 132Z", "#e8c46a") + path("M56 118 Q100 130 144 118 L144 106 Q100 118 56 106Z", C.red)),
  dress: () => frame("#fdeeff", path("M80 34 L120 34 L124 72 L162 168 Q100 180 38 168 L76 72Z", "#e0427a") + line(76, 72, 124, 72, 6, "#fff") + path("M84 34 L84 20 M116 34 L116 20", "none", `stroke-width="5"`) + circle(80, 120, 5, "#fff") + circle(110, 140, 5, "#fff") + circle(130, 110, 5, "#fff")),
  skirt: () => frame("#f5ecff", rect(62, 52, 76, 16, "#7b61c9", 4) + path("M64 68 L136 68 L170 160 L30 160Z", "#9b84e0") + path("M80 68 L66 160 M100 68 L100 160 M120 68 L134 160", "none", `stroke="#7b61c9"`)),
  shoes: () => frame("#eef6ff",
    path("M24 140 L24 104 Q24 96 34 96 L58 96 Q66 120 96 124 Q110 126 110 140Z", C.red) + rect(20, 140, 94, 12, "#fff", 5) +
    path("M96 160 L96 124 Q96 116 106 116 L130 116 Q138 140 168 144 Q182 146 182 160Z", C.blue) + rect(92, 160, 94, 12, "#fff", 5) + line(36, 108, 52, 108, 2.5) + line(108, 128, 124, 128, 2.5)),
  jeans: () => frame("#eef3fb", path("M60 32 L140 32 L150 170 L108 170 L100 82 L92 170 L50 170Z", "#3f6fa0") + rect(60, 32, 80, 14, "#2f5a86", 3) + circle(100, 40, 3, C.sun) + path("M68 54 Q78 66 92 56 M132 54 Q122 66 108 56", "none", `stroke="${C.sun}" stroke-width="2"`)),

  /* ---------- Unit 19: trạng từ ---------- */
  loudly: () => frame("#fff3e0", ground(176, "#f3d79a") +
    circle(84, 104, 46, "#d9893b") + circle(84, 108, 30, "#f2b45a") + circle(72, 98, 4, C.line) + circle(96, 98, 4, C.line) + `<ellipse cx="84" cy="122" rx="12" ry="10" fill="#9b2c2c" stroke="${C.line}" stroke-width="3"/>` + path("M80 108 L88 108 L84 113Z", C.line) +
    path("M140 80 q14 24 0 48 M156 70 q22 34 0 68 M172 60 q30 44 0 88", "none", `stroke="${C.red}" stroke-width="5"`)),
  quietly: () => frame("#2d3a6b", `<circle cx="160" cy="40" r="13" fill="#ffe680" stroke="${C.line}" stroke-width="2.5"/>` + star(40, 34, 5) + ground(160, "#3d5a4a") +
    `<ellipse cx="90" cy="146" rx="40" ry="18" fill="#9aa6ad" stroke="${C.line}" stroke-width="3"/>` + circle(136, 126, 18, "#9aa6ad") + path("M124 114 L126 98 L136 110Z M140 110 L148 98 L150 114Z", "#9aa6ad") +
    path("M130 126 q3 3 6 0 M140 126 q3 3 6 0") + path("M50 140 Q30 120 40 100", "none", `stroke="#9aa6ad" stroke-width="7"`) + `<text x="60" y="90" font-family="Arial" font-weight="900" font-size="22" fill="#fff">shh…</text>`),
  quickly: () => frame("#eaf8de", ground(170) + motion(70, 118, 3, 40) +
    `<ellipse cx="120" cy="140" rx="34" ry="22" fill="#fff" stroke="${C.line}" stroke-width="3"/>` + circle(156, 118, 16, "#fff") + `<ellipse cx="150" cy="88" rx="6" ry="20" fill="#fff" stroke="${C.line}" stroke-width="3" transform="rotate(-20 150 88)"/>` +
    `<ellipse cx="164" cy="90" rx="6" ry="20" fill="#fff" stroke="${C.line}" stroke-width="3" transform="rotate(10 164 90)"/>` + circle(160, 116, 2.5, C.line) + circle(171, 121, 3, C.cheek) + circle(86, 136, 8, "#fff")),
  slowly: () => frame("#eef8f0", ground(160) + path("M30 160 Q60 156 100 160", "none", `stroke="#cfe3c7" stroke-width="6"`) +
    path("M60 160 L60 150 Q60 140 74 140 L150 140 Q166 140 166 152 L166 160Z", "#c9d97a") + circle(112, 118, 32, "#d9893b") + path("M112 92 a20 20 0 1 1 -18 26 a12 12 0 1 1 14 -12", "none") +
    line(64, 142, 54, 112, 3) + line(72, 140, 70, 110, 3) + circle(54, 110, 4, C.line) + circle(70, 108, 4, C.line) + `<text x="40" y="60" font-family="Arial" font-weight="900" font-size="18" fill="#8a9aa5">s l o w</text>`),
  beautifully: () => frame("#eaf3ff", ground(176) +
    [-60, -30, 0, 30, 60].map((a) => { const [x, y] = step(100, 150, 70, 180 + a); return line(100, 150, x, y, 5, "#3d9a50") + circle(x, y, 13, "#2f8fb0") + circle(x, y, 6, C.sun); }).join("") +
    `<ellipse cx="100" cy="150" rx="18" ry="26" fill="#2f6fb5" stroke="${C.line}" stroke-width="3"/>` + circle(100, 116, 11, "#2f6fb5") + circle(103, 113, 2.5, C.line) + path("M108 116 L116 118 L108 120Z", C.sun) + sparkle(30, 40, 8, C.sun) + sparkle(170, 40, 8, C.sun)),

  /* ---------- Unit 20: trại hè ---------- */
  "putting-up-a-tent": () => {
    const k = kid({ x: 150, y: 150, scale: 0.85, armL: [-120, -100], look: -4 });
    return frame("#e6f4ff", ground(170) + tree(30, 120) + tent(84, 170) + line(84, 110, 84, 90, 4) + path("M84 92 L100 98 L84 104Z", C.red) + k.svg + line(k.handL[0], k.handL[1], 118, 132, 3) + line(118, 132, 126, 170, 2));
  },
  "building-a-campfire": () => {
    const k = kid({ x: 60, y: 150, scale: 0.85, armR: [100, 80], look: 4 });
    return frame("#2d3a6b", nightSky() + ground(170, "#3d5a4a") + fire(130, 168) + k.svg + line(k.handR[0], k.handR[1], k.handR[0] + 26, k.handR[1] + 8, 6, C.woodDark));
  },
  "singing-songs": () => {
    const a = kid({ x: 50, y: 154, scale: 0.75, face: "sing", armL: [-150, -170] });
    const b = kid({ x: 150, y: 154, scale: 0.75, face: "sing", longHair: true, shirt: "#c05ad6", armR: [150, 170] });
    return frame("#2d3a6b", nightSky(100) + ground(176, "#3d5a4a") + fire(100, 176) + a.svg + b.svg + note(80, 70, C.sun) + note(122, 92, "#fff"));
  },
  "telling-stories": () => {
    const a = kid({ x: 60, y: 150, scale: 0.8, face: "open", armR: [130, 100], armL: [-130, -100] });
    const b = kid({ x: 150, y: 156, scale: 0.7, face: "o", longHair: true, shirt: "#f28c28", look: -4 });
    return frame("#2d3a6b", nightSky() + ground(176, "#3d5a4a") + a.svg + b.svg + fire(104, 178) +
      path("M70 40 L140 40 Q148 40 148 48 L148 70 Q148 78 140 78 L96 78 L84 90 L86 78 L70 78 Q62 78 62 70 L62 48 Q62 40 70 40Z", "#fff") + star(86, 59, 7) + `<circle cx="112" cy="59" r="7" fill="#ffe680" stroke="${C.line}" stroke-width="2"/>` + circle(132, 59, 4, C.red));
  },
  fishing: () => {
    const k = kid({ x: 54, y: 120, scale: 0.85, armR: [130, 110], hat: "cap", look: 4 });
    return frame(C.sky, sunIcon(170, 30, 12) + ground(130, "#8fd17a") + `<rect x="80" y="130" width="130" height="80" fill="${C.water}"/>` + k.svg +
      line(k.handR[0], k.handR[1], 150, 54, 4, C.woodDark) + line(150, 54, 150, 160, 1.5) + path("M140 170 Q150 160 162 170 Q150 180 140 170Z M162 170 L172 162 L172 178Z", C.sun) + path("M96 150 Q116 144 136 150", "none", `stroke="#fff"`));
  },
  "playing-games": () => {
    const a = kid({ x: 60, y: 146, scale: 0.8, face: "open", armL: [-60, -40], armR: [60, 40], legL: [-30], legR: [30] });
    const b = kid({ x: 144, y: 146, scale: 0.8, face: "open", longHair: true, shirt: C.blue, armL: [-150, -170], armR: [150, 170] });
    return frame("#eaf8de", ground(176) + tent(100, 120, "#7cc4f5") + a.svg + b.svg + circle(104, 168, 11, C.red) + path("M98 160 L110 176", "none", `stroke="#fff" stroke-width="2"`));
  },
};
