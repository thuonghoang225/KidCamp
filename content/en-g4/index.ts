import { Course, Unit } from "../schema";
import unit01 from "./units/unit-01-my-friends";
import unit02 from "./units/unit-02-time-and-daily-routines";
import unit03 from "./units/unit-03-my-week";
import unit04 from "./units/unit-04-my-birthday-party";
import unit05 from "./units/unit-05-things-we-can-do";
import unit06 from "./units/unit-06-our-school-facilities";
import unit07 from "./units/unit-07-our-timetables";
import unit08 from "./units/unit-08-my-favourite-subjects";
import unit09 from "./units/unit-09-our-sports-day";
import unit10 from "./units/unit-10-our-summer-holidays";
import unit11 from "./units/unit-11-my-home";
import unit12 from "./units/unit-12-jobs";
import unit13 from "./units/unit-13-appearance";
import unit14 from "./units/unit-14-daily-activities";
import unit15 from "./units/unit-15-my-familys-weekends";

/** Danh sách Unit theo sách (Unit chưa soạn để trạng thái "soon"). */
const upcoming: Array<[number, string, string]> = [
  [16, "Weather", "Thời tiết"],
  [17, "In the city", "Trong thành phố"],
  [18, "At the shopping centre", "Ở trung tâm thương mại"],
  [19, "The animal world", "Thế giới động vật"],
  [20, "At summer camp", "Ở trại hè"],
];

const placeholders: Unit[] = upcoming.map(([n, title, titleVi]) =>
  Unit.parse({ id: `u${String(n).padStart(2, "0")}`, number: n, title, titleVi, status: "soon" }),
);

const ready: Unit[] = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, unit09, unit10, unit11, unit12, unit13, unit14, unit15].map((u) => Unit.parse(u));

/** Bài Ôn tập: trộn từ và mẫu câu của các Unit trước đó (không có chant, âm). */
function review(n: number, from: Unit[]): Unit {
  return Unit.parse({
    id: `r${n}`,
    number: n,
    kind: "review",
    includes: from.map((u) => u.id),
    title: `Review ${n}`,
    titleVi: `Ôn tập Unit ${from[0].number}–${from.at(-1)!.number}`,
    status: "ready",
    words: [...new Set(from.flatMap((u) => u.words))],
    patterns: from.flatMap((u) => u.patterns),
    stations: [
      { id: "words", title: "Ôn từ vựng", subtitle: `Từ của Unit ${from[0].number}–${from.at(-1)!.number}`, exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
      { id: "patterns", title: "Ôn mẫu câu", subtitle: "Hỏi và trả lời", exercises: ["pick-answer", "order-words", "say-sentence"] },
      { id: "challenge", title: "Bài kiểm tra", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
    ],
  });
}

export const enG4: Course = Course.parse({
  id: "en-g4",
  subject: "english",
  title: "English 4 · Global Success",
  titleVi: "Tiếng Anh lớp 4",
  status: "ready",
  units: [
    ...ready.slice(0, 5), review(1, ready.slice(0, 5)),
    ...ready.slice(5, 10), review(2, ready.slice(5, 10)),
    ...ready.slice(10, 15), review(3, ready.slice(10, 15)),
    ...placeholders,
  ],
});
