import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u12.jobs",
  courseId: "en-g4",
  unitId: "u12",
  title: "Family jobs",
  titleVi: "Nghề của bố mẹ",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "My father is a pilot. What does your father do?", expectPattern: "s.what-does-your-father-do", hints: ["He's a doctor.", "He's a …", "He's …"] },
    { say: "Cool! What does your mother do?", expectPattern: "s.what-does-your-mother-do", hints: ["She's a teacher.", "She's a …", "She's …"] },
    { say: "That's great. My mother is a nurse!" },
  ],
};

export default dialogue;
