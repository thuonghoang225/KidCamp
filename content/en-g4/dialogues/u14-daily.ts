import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u14.daily",
  courseId: "en-g4",
  unitId: "u14",
  title: "My day",
  titleVi: "Một ngày của em",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "I play games in the afternoon. What do you do in the afternoon?", expectPattern: "s.what-do-you-do-in-the", hints: ["I read books.", "I …", "I …"] },
    { say: "Good! When do you do homework?", expectPattern: "s.when-do-you-act", hints: ["I do it in the evening.", "I do it in the …", "In the …"] },
    { say: "Me too! Then I go to bed. Good night!" },
  ],
};

export default dialogue;
