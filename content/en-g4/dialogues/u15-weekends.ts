import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u15.weekends",
  courseId: "en-g4",
  unitId: "u15",
  title: "Weekend plans",
  titleVi: "Kế hoạch cuối tuần",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "On weekends, I go to the swimming pool. Where do you go on weekends?", expectPattern: "s.where-do-you-go-on-weekends", hints: ["I go to the cinema.", "I go to the …", "I go …"] },
    { say: "Fun! Do you go to the zoo on Sundays?", expectPattern: "s.do-you-go-to-the", hints: ["Yes, I do.", "Yes, I …", "Yes …"] },
    { say: "Let's go together next time!" },
  ],
};

export default dialogue;
