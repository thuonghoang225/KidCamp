import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u04.party",
  courseId: "en-g4",
  unitId: "u04",
  title: "At the party",
  titleVi: "Ở bữa tiệc",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Welcome to my birthday party! When's your birthday?", expectPattern: "s.when-is-your-birthday", hints: ["It's in June.", "It's in …", "It's …"] },
    { say: "Cool! What would you like to eat?", expectPattern: "s.what-would-you-like-to-eat", hints: ["I'd like some cake.", "I'd like some …", "I'd …"] },
    { say: "Here you are. What would you like to drink?", expectPattern: "s.what-would-you-like-to-drink", hints: ["I'd like some juice.", "I'd like some …", "I'd …"] },
    { say: "Here you are. Let's have fun!" },
  ],
};

export default dialogue;
