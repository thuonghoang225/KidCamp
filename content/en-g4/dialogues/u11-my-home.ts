import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u11.my-home",
  courseId: "en-g4",
  unitId: "u11",
  title: "My home",
  titleVi: "Nhà của em",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "I live in a house near the beach. Where do you live?", expectPattern: "s.where-do-you-live", hints: ["I live in a flat.", "I live in a …", "I live …"] },
    { say: "Nice! What's the street like?", expectPattern: "s.whats-the-street-like", hints: ["It's busy.", "It's …", "It …"] },
    { say: "My street is quiet. I can hear the birds!" },
  ],
};

export default dialogue;
