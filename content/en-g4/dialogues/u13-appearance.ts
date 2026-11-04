import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u13.appearance",
  courseId: "en-g4",
  unitId: "u13",
  title: "Guess who",
  titleVi: "Đoán xem là ai",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Look at this photo. That's your teacher! What does he look like?", expectPattern: "s.what-does-he-look-like", hints: ["He's tall.", "He's …", "He …"] },
    { say: "And this is your friend. What does she look like?", expectPattern: "s.what-does-she-look-like", hints: ["She's short.", "She's …", "She …"] },
    { say: "Ha ha! I know them now. Thank you!" },
  ],
};

export default dialogue;
