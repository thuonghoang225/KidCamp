/**
 * Hình minh họa KidCamp tự vẽ cho các từ chỉ hành động.
 * Mỗi hình: cùng một nhân vật bé + đồ vật đặc trưng, để bé nhận ra hành động.
 */
import { C, circle, frame, kid, limb, line, moon, motion, note, path, rect, sparkle, star, step, sunIcon, wallClock } from "./kit";

const ground = (y: number, fill = C.grass) => `<rect x="-5" y="${y}" width="210" height="${205 - y}" fill="${fill}"/>`;
const floor = (y: number) => ground(y, "#f1dcc0");
const table = (x: number, y: number, w: number) => rect(x, y, w, 10, C.wood, 3) + rect(x + 8, y + 10, 8, 200 - y, C.woodDark, 2) + rect(x + w - 16, y + 10, 8, 200 - y, C.woodDark, 2);
const windowPane = (x: number, y: number, w: number, h: number, sky: string, inner = "") =>
  rect(x, y, w, h, sky, 4) + inner + line(x + w / 2, y, x + w / 2, y + h, 4) + line(x, y + h / 2, x + w, y + h / 2, 4) + rect(x, y, w, h, "none", 4);
const bowl = (x: number, y: number) => path(`M${x - 18} ${y} Q${x} ${y + 26} ${x + 18} ${y}Z`, C.white) + path(`M${x - 14} ${y - 1} Q${x} ${y - 9} ${x + 14} ${y - 1}`, "#f3d27a");
const bed = (headX = 18) =>
  rect(headX, 100, 16, 80, C.woodDark, 4) + rect(headX, 140, 170, 22, C.wood, 4) + rect(headX + 8, 162, 8, 30, C.woodDark, 2) + rect(headX + 158, 162, 8, 30, C.woodDark, 2);

export const actionArt: Record<string, () => string> = {
  /* ---------- Unit 2: việc hằng ngày ---------- */
  "get-up": () => {
    const k = kid({ x: 74, y: 140, armL: [-140, -160], armR: [140, 160], face: "open", noLegs: true });
    return frame("#fff3d6",
      windowPane(120, 22, 62, 54, C.sky, sunIcon(151, 49, 12)) + bed() + rect(26, 112, 34, 22, C.white, 10) + k.svg +
      path("M52 128 Q120 118 186 128 L186 158 L52 158Z", "#7cc4f5") + wallClock(36, 40, 6, 16));
  },
  "have-breakfast": () => {
    const k = kid({ x: 100, y: 150, armL: [-15, -80], armR: [150, -58], noLegs: true });
    return frame("#fff3d6",
      windowPane(18, 18, 56, 48, "#ffe3b3", sunIcon(46, 62, 12)) + wallClock(166, 38, 7) + k.svg +
      line(k.handR[0], k.handR[1], k.handR[0] + 14, k.handR[1] + 8, 4, "#9aa6ad") +
      table(14, 150, 172) + bowl(66, 146) + rect(126, 120, 18, 28, C.white, 4) + rect(129, 128, 12, 17, "#fdfdfd", 2));
  },
  "go-to-school": () => {
    const k = kid({ x: 64, y: 150, legL: [-28, -10], legR: [26, 12], armL: [28, 10], armR: [-28, -14], look: 4, behind: rect(38, 108, 18, 34, C.red, 6) });
    return frame(C.sky,
      ground(168) + rect(114, 66, 76, 104, "#f6e3c3", 4) + path("M106 70 L152 34 L198 70Z", C.red) + rect(140, 128, 24, 42, C.woodDark, 3) +
      rect(122, 84, 18, 16, "#bfe6ff", 2) + rect(164, 84, 18, 16, "#bfe6ff", 2) + line(152, 34, 152, 12, 3) + path("M152 12 L170 18 L152 24Z", C.shirt) +
      path("M0 182 Q60 176 140 172", "none", `stroke="#d9c3a0" stroke-width="10"`) + k.svg);
  },
  "have-lunch": () => {
    const k = kid({ x: 100, y: 150, armL: [-30, -70], armR: [150, -58], noLegs: true });
    return frame("#e6f6ff",
      sunIcon(40, 36, 15) + wallClock(166, 38, 12) + k.svg +
      rect(k.handR[0] - 6, k.handR[1] - 2, 18, 12, "#ffe6a6", 3) +
      table(14, 150, 172) + rect(46, 128, 52, 22, C.red, 4) + rect(50, 132, 22, 14, C.white, 3) + rect(75, 132, 19, 14, "#8fd17a", 3));
  },
  "do-homework": () => {
    const k = kid({ x: 90, y: 150, armL: [-20, 40], armR: [30, 70], look: 3, noLegs: true });
    return frame("#efe9ff",
      path("M150 40 L176 40 L168 78 L158 78Z", C.sun) + line(163, 78, 163, 140, 4) + rect(148, 140, 30, 8, C.line, 3) +
      k.svg + table(10, 150, 180) + path("M60 146 L96 140 L132 146 L132 150 L60 150Z", C.white) + line(96, 140, 96, 150) +
      line(k.handR[0], k.handR[1], k.handR[0] + 10, k.handR[1] + 14, 5, "#f5b301") + line(108, 145, 124, 144, 2, "#8a9aa5"));
  },
  "have-dinner": () => {
    const k = kid({ x: 100, y: 150, armL: [-20, -60], armR: [150, -60], noLegs: true });
    return frame("#3a4778",
      windowPane(18, 18, 56, 48, C.night, moon(46, 36, 10) + star(62, 54, 4)) + wallClock(166, 38, 7) + k.svg +
      line(k.handR[0], k.handR[1], k.handR[0] + 12, k.handR[1] + 12, 4, "#9aa6ad") +
      table(14, 150, 172) + rect(40, 120, 48, 30, "#e0563f", 8) + rect(34, 116, 60, 8, "#c4432f", 4) +
      path("M54 110 q-6 -10 0 -18 M68 110 q-6 -10 0 -18", "none", `stroke="#fff" opacity=".8"`) +
      `<ellipse cx="138" cy="148" rx="24" ry="6" fill="#fff" stroke="${C.line}" stroke-width="3"/>`);
  },
  "go-to-bed": () => {
    const head = circle(54, 128, 18, C.skin);
    return frame(C.night,
      moon(160, 40, 16) + star(40, 34, 6) + star(110, 26, 5) + star(130, 60, 4) +
      rect(10, 96, 14, 96, C.woodDark, 4) + rect(10, 146, 186, 22, C.wood, 4) + rect(24, 120, 44, 26, C.white, 12) +
      head + path("M38 122 C34 100 72 100 70 124 C62 116 46 116 38 122Z", C.hair) +
      path("M45 130 q3 3 6 0 M57 130 q3 3 6 0") + `<circle cx="46" cy="137" r="3" fill="${C.cheek}" opacity=".6"/>` +
      path("M66 130 Q130 112 192 132 L192 158 L66 158Z", "#7cc4f5") + path("M80 134 Q120 126 170 136", "none", `stroke="#fff" stroke-dasharray="6 6"`) +
      `<text x="86" y="92" font-family="Arial" font-weight="900" font-size="22" fill="#fff">z</text><text x="100" y="74" font-family="Arial" font-weight="900" font-size="28" fill="#fff">Z</text>`);
  },

  /* ---------- Unit 5: những việc em làm được ---------- */
  swim: () => {
    const k = kid({ x: 104, y: 160, armL: [-110, -95], armR: [150, 110], hat: "swimcap", goggles: true, noLegs: true, shirt: C.skin });
    return frame("#cfeeff",
      sunIcon(166, 32, 12) + k.svg +
      path("M-5 140 Q20 128 45 140 T95 140 T145 140 T195 140 T245 140 L245 205 L-5 205Z", C.water, `opacity=".92"`) +
      path("M10 166 Q30 158 50 166 M120 176 Q140 168 160 176", "none", `stroke="#fff"`) + circle(40, 112, 5, "#fff") + circle(30, 98, 3.5, "#fff"));
  },
  "ride-a-bike": () => {
    const bike =
      circle(52, 160, 26, "none", `stroke-width="6"`) + circle(148, 160, 26, "none", `stroke-width="6"`) +
      path("M52 160 L84 124 L134 124 L148 160 M84 124 L100 160 L134 124 M100 160 L52 160", "none", `stroke="${C.red}" stroke-width="6"`) +
      line(134, 124, 140, 104, 5) + line(132, 102, 148, 102, 6) + line(76, 118, 94, 118, 7) + circle(100, 160, 6, C.grey);
    const k = kid({ x: 86, y: 118, legL: [60, -10], legR: [40, 10], armL: [110, 95], armR: [115, 100], hat: "helmet", look: 4 });
    return frame(C.sky, ground(178) + motion(30, 100) + bike + k.svg);
  },
  "play-the-guitar": () => {
    const k = kid({ x: 92, y: 150, armL: [-10, 70], armR: [130, 95], face: "sing" });
    const guitar = path("M60 150 C44 140 50 116 70 120 C76 108 98 110 98 126 C114 132 108 160 88 160 C80 164 66 160 60 150Z", "#e08a3c") +
      circle(80, 140, 7, C.line) + `<path d="M92 128 L150 92" stroke="${C.line}" stroke-width="12" stroke-linecap="round"/><path d="M92 128 L150 92" stroke="${C.woodDark}" stroke-width="6" stroke-linecap="round"/>` + rect(146, 82, 16, 14, C.woodDark, 3, `transform="rotate(-32 154 89)"`);
    return frame("#ffeedd", note(156, 40) + note(34, 54, C.red) + k.svg + guitar + circle(k.handL[0], k.handL[1], 5, C.skin) + circle(k.handR[0], k.handR[1], 5, C.skin));
  },
  draw: () => {
    const k = kid({ x: 64, y: 150, armL: [-30, -10], armR: [120, 100], look: 4 });
    const easel = line(120, 70, 108, 190, 6, C.woodDark) + line(168, 70, 180, 190, 6, C.woodDark) + rect(104, 44, 80, 84, C.white, 4) +
      sunIcon(128, 70, 9) + path("M114 118 Q130 96 146 118 Q160 96 176 118Z", "#8fd17a") + path("M150 74 q10 -10 20 0 q-10 10 -20 0", "#ef5a4c");
    return frame("#fff4f0", floor(176) + easel + k.svg + line(k.handR[0], k.handR[1], k.handR[0] + 14, k.handR[1] - 8, 5, C.woodDark) + circle(k.handR[0] + 16, k.handR[1] - 9, 4, C.blue) +
      `<ellipse cx="${k.handL[0] - 2}" cy="${k.handL[1] + 4}" rx="16" ry="10" fill="#f6dfb0" stroke="${C.line}" stroke-width="3"/>` + circle(k.handL[0] - 8, k.handL[1] + 2, 3, C.red) + circle(k.handL[0] + 4, k.handL[1] + 7, 3, C.blue));
  },
  dance: () => {
    const k = kid({ x: 100, y: 140, armL: [-140, -170], armR: [120, 60], legL: [-10, 0], legR: [70, 30], face: "open", shirt: "#c05ad6" });
    return frame("#fde8ff", `<path d="M60 0 L140 0 L180 200 L20 200Z" fill="#fff6c9" opacity=".8"/>` + floor(184) + note(36, 60, "#c05ad6") + note(160, 40) + note(150, 104, C.red) + k.svg);
  },
  sing: () => {
    const k = kid({ x: 92, y: 150, armL: [-20, -8], armR: [150, -60], face: "sing" });
    const mic = `<g transform="rotate(-25 ${k.handR[0]} ${k.handR[1]})">${rect(k.handR[0] - 4, k.handR[1] - 8, 8, 24, C.line, 3)}${circle(k.handR[0], k.handR[1] - 14, 8, C.grey)}</g>`;
    return frame("#e9f3ff", floor(184) + note(146, 50, C.blue) + note(166, 92, C.red) + note(40, 46) + k.svg + mic);
  },
  skate: () => {
    const k = kid({ x: 100, y: 140, armL: [-110, -95], armR: [110, 95], legL: [-20, 10], legR: [30, -5], shoes: "skates", look: 4, hat: "helmet" });
    return frame("#e8f8ee", ground(180, "#d4dde2") + motion(48, 108) + k.svg);
  },
  cook: () => {
    const k = kid({ x: 80, y: 150, armL: [-20, -8], armR: [100, 60], hat: "chef", look: 4, face: "open" });
    return frame("#fff3e6",
      rect(108, 140, 92, 60, "#d7dee3", 4) + path("M126 136 q4 -8 8 0 q4 -8 8 0 q4 -8 8 0", "none", `stroke="#f06a3a"`) +
      k.svg + path("M118 128 L170 128 L164 144 L124 144Z", C.line) + line(170, 132, 196, 126, 6) +
      circle(144, 124, 8, "#ffdb66") + circle(144, 124, 3.5, "#f5a300") + line(k.handR[0], k.handR[1], k.handR[0] + 16, k.handR[1] - 12, 5, C.woodDark) +
      path("M136 112 q-4 -10 2 -18 M152 112 q-4 -10 2 -18", "none", `stroke="#9aa6ad" opacity=".7"`));
  },
  "play-chess": () => {
    const k = kid({ x: 100, y: 150, armL: [-30, -150], armR: [40, 80], face: "think", noLegs: true });
    const board = Array.from({ length: 16 }, (_, i) => {
      const cx = 56 + (i % 4) * 22, cy = 150 + Math.floor(i / 4) * 0;
      return i < 4 ? rect(cx, cy - 12, 22, 12, i % 2 ? C.line : C.white, 0) : "";
    }).join("");
    const pawn = (x: number, y: number, fill: string) => circle(x, y - 14, 5, fill) + path(`M${x - 7} ${y} L${x - 4} ${y - 10} L${x + 4} ${y - 10} L${x + 7} ${y}Z`, fill);
    return frame("#f2ecff", k.svg + table(14, 150, 172) + path("M44 150 L60 126 L140 126 L156 150Z", C.white) +
      path("M60 126 L156 150 M80 126 L68 150 M100 126 L100 150 M120 126 L132 150 M52 138 L148 138", "none", `stroke="#bbb"`) +
      pawn(78, 144, C.line) + pawn(122, 140, C.white) + board.slice(0, 0) +
      `<text x="140" y="70" font-family="Arial" font-weight="900" font-size="30" fill="#7b61c9">?</text>`);
  },

  /* ---------- Unit 3, 9: thể thao và giải trí ---------- */
  "play-football": () => {
    const k = kid({ x: 82, y: 140, armL: [-60, -30], armR: [60, 30], legL: [-8, 4], legR: [-60, -40], look: 4 });
    const goal = rect(140, 60, 64, 110, "none", 2, `stroke-width="5"`) +
      Array.from({ length: 5 }, (_, i) => line(150 + i * 12, 62, 150 + i * 12, 168, 1.5, "#9aa6ad")).join("") +
      Array.from({ length: 8 }, (_, i) => line(142, 72 + i * 12, 200, 72 + i * 12, 1.5, "#9aa6ad")).join("");
    const ball = circle(120, 160, 13, C.white) + path("M120 152 L127 157 L124 165 L116 165 L113 157Z", C.line);
    return frame(C.sky, ground(170) + goal + k.svg + ball + motion(104, 152, 2, 14));
  },
  "watch-tv": () => {
    const k = kid({ x: 132, y: 154, armL: [-20, 20], armR: [20, -20], legL: [-80, 0], legR: [-70, 0], look: -4, noLegs: true });
    return frame("#f3ecff", floor(170) +
      rect(14, 64, 74, 56, C.line, 6) + rect(20, 70, 62, 44, "#7cc4f5", 3) + circle(42, 88, 7, C.sun) + path("M24 112 Q44 96 62 112Z", "#8fd17a") + line(40, 120, 30, 136, 4) + line(62, 120, 72, 136, 4) + rect(10, 136, 82, 12, C.woodDark, 3) +
      rect(100, 112, 96, 50, "#e86f5a", 14) + k.svg + rect(96, 150, 104, 26, "#e86f5a", 10) + rect(92, 128, 16, 46, "#d95a45", 8) + rect(190, 128, 16, 46, "#d95a45", 8));
  },
  "listen-to-music": () => {
    const k = kid({ x: 100, y: 150, armL: [-20, 60], armR: [20, -40], face: "closed", headphones: true });
    return frame("#eaf6ff", floor(184) + note(38, 56, C.blue) + note(156, 48, C.red) + note(166, 104) + k.svg + rect(k.handL[0] - 6, k.handL[1] - 12, 14, 22, C.line, 3) + rect(k.handL[0] - 3, k.handL[1] - 9, 8, 14, "#7cc4f5", 2));
  },
  "go-swimming": () => {
    const k = kid({ x: 92, y: 118, armL: [-160, -170], armR: [160, 170], legL: [-10, 10], legR: [10, -10], hat: "swimcap", shirt: C.red, pants: C.skin, shoes: "none", face: "open" });
    return frame("#e6f6ff",
      rect(-5, 150, 210, 60, C.water) + rect(-5, 146, 70, 10, "#f2f2f2", 0) + line(150, 120, 150, 172, 5, C.grey) + line(168, 120, 168, 172, 5, C.grey) +
      line(150, 136, 168, 136, 4, C.grey) + line(150, 152, 168, 152, 4, C.grey) +
      path("M20 166 Q40 160 60 166 M110 180 Q130 174 150 180", "none", `stroke="#fff"`) + `<g transform="rotate(-10 92 118)">${k.svg}</g>` + sparkle(140, 40, 8, C.sun));
  },
  running: () => {
    const k = kid({ x: 100, y: 130, armL: [60, 150], armR: [-50, -150], legL: [-50, 10], legR: [60, -30], look: 4, shirt: "#f06a3a", face: "open" });
    return frame("#fff4dc", ground(176, "#e8a87c") + line(-5, 186, 205, 186, 3, "#fff") + motion(60, 100) + k.svg + rect(88, 98, 24, 18, C.white, 3) + `<text x="100" y="112" font-family="Arial" font-weight="900" font-size="13" text-anchor="middle" fill="${C.line}">1</text>`);
  },

  /* ---------- Unit 14: việc nhà, giải trí ---------- */
  "wash-the-dishes": () => {
    const k = kid({ x: 72, y: 160, armL: [60, 100], armR: [100, 80], look: 4, noLegs: true });
    return frame("#e8f6ff",
      k.svg + rect(20, 140, 180, 60, "#d7dee3", 4) + rect(70, 128, 110, 20, "#9fb2bd", 6) + path("M150 88 L150 72 L126 72 L126 84", "none", `stroke="${C.grey}" stroke-width="8"`) +
      line(126, 92, 126, 126, 4, "#5fb8f0") + `<ellipse cx="110" cy="126" rx="20" ry="10" fill="#fff" stroke="${C.line}" stroke-width="3"/>` +
      circle(k.handR[0], k.handR[1], 5, C.skin) + circle(150, 116, 8, "#fff", `opacity=".9"`) + circle(164, 110, 5, "#fff") + circle(92, 112, 6, "#fff") + circle(80, 104, 4, "#fff"));
  },
  "clean-the-floor": () => {
    const k = kid({ x: 84, y: 150, armL: [70, 110], armR: [60, 40], look: 4 });
    return frame("#f0fbf2", floor(178) + line(98, 92, 140, 172, 6, C.woodDark) + path("M124 170 L160 166 L164 182 L128 186Z", "#7cc4f5") +
      k.svg + circle(k.handL[0], k.handL[1], 5, C.skin) + sparkle(166, 140) + sparkle(182, 160, 6) + sparkle(30, 168, 6) +
      path("M20 150 L44 150 L40 178 L24 178Z", C.blue) + path("M22 150 Q32 138 42 150", "none"));
  },
  "read-books": () => {
    const k = kid({ x: 100, y: 156, armL: [40, 100], armR: [-40, -100], legL: [-80, 30], legR: [80, -30], look: 0 });
    return frame("#fff8e6", floor(176) +
      k.svg + path("M100 136 L68 128 L68 102 L100 110 L132 102 L132 128Z", C.white) + line(100, 110, 100, 136) +
      path("M74 112 L94 116 M74 120 L94 124 M106 116 L126 112 M106 124 L126 120", "none", `stroke="#9aa6ad" stroke-width="2"`) +
      circle(68, 118, 5, C.skin) + circle(132, 118, 5, C.skin) + rect(140, 150, 50, 12, C.blue, 2) + rect(144, 138, 44, 12, C.red, 2) + rect(142, 126, 46, 12, C.shirt, 2));
  },
  "play-games": () => {
    const k = kid({ x: 100, y: 160, armL: [40, 100], armR: [-40, -100], legL: [-80, 30], legR: [80, -30], face: "open" });
    return frame("#efe9ff", floor(180) +
      rect(52, 20, 96, 64, C.line, 8) + rect(58, 26, 84, 52, "#3b3f6b", 4) + star(80, 50, 9) + rect(104, 56, 12, 12, "#8fd17a", 1) + rect(116, 44, 12, 12, "#ef5a4c", 1) +
      k.svg + rect(74, 112, 52, 24, "#555d75", 12) + line(86, 124, 94, 124, 4, "#fff") + line(90, 120, 90, 128, 4, "#fff") + circle(110, 120, 3.5, C.red) + circle(117, 127, 3.5, C.sun) +
      circle(74, 124, 5, C.skin) + circle(126, 124, 5, C.skin));
  },
};

/** Góc để tránh lỗi "biến không dùng" khi chỉnh hình. */
void step;
void limb;
