import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u20.camp",
  courseId: "en-g4",
  unitId: "u20",
  title: "Camp call",
  titleVi: "Gọi từ trại hè",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! I'm at summer camp. I'm fishing now. What are you doing?", expectPattern: "s.what-are-you-doing", hints: ["I'm singing songs.", "I'm …", "I …"] },
    { say: "Fun! Look at my friends. What are they doing?", expectPattern: "s.what-are-they-doing", hints: ["They're building a campfire.", "They're …", "They …"] },
    { say: "Right! Camp is great. Bye for now!" },
  ],
};

export default dialogue;
