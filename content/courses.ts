import type { Course, Dialogue, Pattern, Unit } from "./schema";
import { Dialogue as DialogueSchema } from "./schema";
import { enG4 } from "./en-g4";
import newFriend from "./en-g4/dialogues/u01-new-friend";
import morning from "./en-g4/dialogues/u02-morning";
import weekend from "./en-g4/dialogues/u03-weekend";
import party from "./en-g4/dialogues/u04-party";
import talent from "./en-g4/dialogues/u05-talent";
import schoolTour from "./en-g4/dialogues/u06-school-tour";
import timetable from "./en-g4/dialogues/u07-timetable";
import favourite from "./en-g4/dialogues/u08-favourite";
import sportsDay from "./en-g4/dialogues/u09-sports-day";
import summer from "./en-g4/dialogues/u10-summer";
import myHome from "./en-g4/dialogues/u11-my-home";
import jobs from "./en-g4/dialogues/u12-jobs";
import appearance from "./en-g4/dialogues/u13-appearance";
import daily from "./en-g4/dialogues/u14-daily";
import weekends from "./en-g4/dialogues/u15-weekends";

export type SubjectInfo = {
  id: "english" | "math";
  name: string;
  icon: "language" | "calculator";
  status: "ready" | "soon";
  courses: string[];
};

/** Các môn trên màn chọn môn. Thêm môn mới = thêm một dòng + khóa của môn đó. */
export const subjects: SubjectInfo[] = [
  { id: "english", name: "Tiếng Anh", icon: "language", status: "ready", courses: ["en-g4"] },
  { id: "math", name: "Toán", icon: "calculator", status: "soon", courses: [] },
];

export const courses: ReadonlyMap<string, Course> = new Map([[enG4.id, enG4]]);

export const dialogues: Dialogue[] = [newFriend, morning, weekend, party, talent, schoolTour, timetable, favourite, sportsDay, summer, myHome, jobs, appearance, daily, weekends].map((d) => DialogueSchema.parse(d));

export function getCourse(courseId: string): Course | undefined {
  return courses.get(courseId);
}

export function getUnit(courseId: string, unitId: string): Unit | undefined {
  return getCourse(courseId)?.units.find((u) => u.id === unitId);
}

/** Tìm mẫu câu theo ID trong mọi khóa. */
export function findPattern(patternId: string): { course: Course; unit: Unit; pattern: Pattern } | undefined {
  for (const course of courses.values()) {
    for (const unit of course.units) {
      const pattern = unit.patterns.find((p) => p.id === patternId);
      if (pattern) return { course, unit, pattern };
    }
  }
  return undefined;
}
