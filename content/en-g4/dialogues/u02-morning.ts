import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u02.morning",
  courseId: "en-g4",
  unitId: "u02",
  title: "Good morning!",
  titleVi: "Chào buổi sáng",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Good morning! What time is it?", expectPattern: "s.what-time-is-it", hints: ["It's six o'clock.", "It's … o'clock.", "It's …"] },
    { say: "Oh, it's early! What time do you get up?", expectPattern: "s.what-time-get-up", hints: ["I get up at six o'clock.", "I get up at …", "I get …"] },
    { say: "Me too. And what time do you go to school?", expectPattern: "s.what-time-go-to-school", hints: ["I go to school at seven o'clock.", "I go to school at …", "I go …"] },
    { say: "Great! See you at school!" },
  ],
};

export default dialogue;
