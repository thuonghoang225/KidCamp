import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u07.timetable",
  courseId: "en-g4",
  unitId: "u07",
  title: "My timetable",
  titleVi: "Thời khóa biểu của em",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! It's Monday. What subjects do you have today?", expectPattern: "s.what-subjects-today", hints: ["I have English today.", "I have … today.", "I have …"] },
    { say: "Nice! When do you have Music?", expectPattern: "s.when-do-you-have", hints: ["I have it on Friday.", "I have it on …", "I have …"] },
    { say: "I have Music on Friday too. See you!" },
  ],
};

export default dialogue;
