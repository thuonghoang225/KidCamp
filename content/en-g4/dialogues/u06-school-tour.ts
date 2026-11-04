import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u06.school-tour",
  courseId: "en-g4",
  unitId: "u06",
  title: "School tour",
  titleVi: "Tham quan trường",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! Welcome to my school. Is there a library at your school?", expectPattern: "s.is-there-a", hints: ["Yes, there is.", "Yes, there …", "Yes …"] },
    { say: "Cool! How many classrooms are there?", expectPattern: "s.how-many-classrooms", hints: ["There are twenty classrooms.", "There are … classrooms.", "There are …"] },
    { say: "Wow, that's a big school! Let's go to the playground!" },
  ],
};

export default dialogue;
