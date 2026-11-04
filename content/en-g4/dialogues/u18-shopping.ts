import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u18.shopping",
  courseId: "en-g4",
  unitId: "u18",
  title: "At the shop",
  titleVi: "Ở cửa hàng",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hello! Welcome to my shop. What would you like to buy?", expectPattern: "s.what-would-you-like-to-buy", hints: ["I'd like a hat.", "I'd like a …", "I'd like …"] },
    { say: "Good choice! Now ask me: how much is the hat? It's fifty thousand dong. How much is the hat?", expectPattern: "s.how-much-is-the", hints: ["It's fifty thousand dong.", "It's … dong.", "It's …"] },
    { say: "Here you are. Thank you!" },
  ],
};

export default dialogue;
