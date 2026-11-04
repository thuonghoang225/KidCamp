import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u10.summer",
  courseId: "en-g4",
  unitId: "u10",
  title: "Back to school",
  titleVi: "Ngày đầu đi học lại",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! Welcome back! Where were you last summer?", expectPattern: "s.where-were-you-last-summer", hints: ["I was at the beach.", "I was at the …", "I was …"] },
    { say: "Wow! Were you at the zoo last weekend?", expectPattern: "s.were-you-at-the", hints: ["Yes, I was.", "Yes, I …", "Yes …"] },
    { say: "Lucky you! I was at the museum. Let's go to class!" },
  ],
};

export default dialogue;
