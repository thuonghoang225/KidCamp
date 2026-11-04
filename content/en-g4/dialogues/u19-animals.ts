import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u19.animals",
  courseId: "en-g4",
  unitId: "u19",
  title: "At the zoo",
  titleVi: "Ở sở thú",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Look at the lion! How does the lion roar?", expectPattern: "s.how-does-the-lion-roar", hints: ["It roars loudly.", "It roars …", "It …"] },
    { say: "And the elephant. How does the elephant walk?", expectPattern: "s.how-does-the-elephant-walk", hints: ["It walks slowly.", "It walks …", "It …"] },
    { say: "Yes! Let's go and see the rabbits now." },
  ],
};

export default dialogue;
