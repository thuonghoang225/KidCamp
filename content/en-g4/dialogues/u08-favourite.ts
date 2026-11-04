import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u08.favourite",
  courseId: "en-g4",
  unitId: "u08",
  title: "Favourite subjects",
  titleVi: "Môn học yêu thích",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hello! What's your favourite subject?", expectPattern: "s.favourite-subject", hints: ["It's English.", "It's …", "It's …"] },
    { say: "Me too! Why do you like English?", expectPattern: "s.why-do-you-like", hints: ["Because it's fun.", "Because it's …", "Because …"] },
    { say: "Great! English is fun for me too!" },
  ],
};

export default dialogue;
