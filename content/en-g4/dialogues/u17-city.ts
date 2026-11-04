import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u17.city",
  courseId: "en-g4",
  unitId: "u17",
  title: "Around town",
  titleVi: "Đi quanh thành phố",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "I'm visiting your city! How can I get to the park?", expectPattern: "s.how-can-i-get-to", hints: ["You can go by bus.", "You can go by …", "You can …"] },
    { say: "Thanks! And how do you go to school?", expectPattern: "s.how-do-you-go-to-school", hints: ["I go by bike.", "I go by …", "I go …"] },
    { say: "Cool! See you at the park!" },
  ],
};

export default dialogue;
