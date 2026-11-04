import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u09.sports-day",
  courseId: "en-g4",
  unitId: "u09",
  title: "Sports day",
  titleVi: "Ngày hội thể thao",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! When's your sports day?", expectPattern: "s.when-is-sports-day", hints: ["It's in June.", "It's in …", "It's …"] },
    { say: "Fun! What do you play on sports day?", expectPattern: "s.what-do-you-play", hints: ["I play badminton.", "I play …", "I …"] },
    { say: "Cool! I play basketball. Good luck!" },
  ],
};

export default dialogue;
