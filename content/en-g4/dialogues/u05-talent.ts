import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u05.talent",
  courseId: "en-g4",
  unitId: "u05",
  title: "Talent show",
  titleVi: "Buổi biểu diễn tài năng",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! Our school has a talent show. Can you sing?", expectPattern: "s.can-you", hints: ["Yes, I can.", "Yes, I …", "Yes …"] },
    { say: "Great! What can you do?", expectPattern: "s.what-can-you-do", hints: ["I can dance.", "I can …", "I …"] },
    { say: "Wow! Look at Mai. What can she do?", expectPattern: "s.what-can-she-do", hints: ["She can draw.", "She can …", "She …"] },
    { say: "Amazing! See you at the show!" },
  ],
};

export default dialogue;
