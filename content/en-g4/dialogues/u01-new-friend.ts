import type { DialogueInput } from "../../schema";

/** Đóng vai: làm quen bạn mới (Unit 1). Bé chơi 3 lượt, mỗi lượt bớt gợi ý. */
const dialogue: DialogueInput = {
  id: "d.u01.new-friend",
  courseId: "en-g4",
  unitId: "u01",
  title: "A new friend",
  titleVi: "Làm quen bạn mới",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! I'm Lucy. Nice to meet you.", expectPattern: "s.nice-to-meet-you", hints: ["Nice to meet you, too.", "Nice to meet you, …", "N…"] },
    { say: "Where are you from?", expectPattern: "s.where-are-you-from", hints: ["I'm from Viet Nam.", "I'm from …", "I'm …"] },
    { say: "Cool! I'm from Australia. Look, this is Miko. She's from Japan." },
    { say: "Where is she from?", expectPattern: "s.where-is-she-from", hints: ["She's from Japan.", "She's from …", "She's …"] },
    { say: "Yes! And that is Tom. He's from Britain. Where is he from?", expectPattern: "s.where-is-he-from", hints: ["He's from Britain.", "He's from …", "He's …"] },
    { say: "Great job! Bye-bye!" },
  ],
};

export default dialogue;
