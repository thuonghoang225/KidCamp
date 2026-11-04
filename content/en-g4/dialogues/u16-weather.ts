import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u16.weather",
  courseId: "en-g4",
  unitId: "u16",
  title: "Weather call",
  titleVi: "Gọi hỏi thời tiết",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hi! It's sunny here in Sydney. What's the weather like today?", expectPattern: "s.whats-the-weather-like", hints: ["It's rainy.", "It's …", "It …"] },
    { say: "Oh! Is it cold today?", expectPattern: "s.is-it-weather-today", hints: ["No, it isn't.", "No, it …", "No …"] },
    { say: "Lucky you! Let's play outside this weekend." },
  ],
};

export default dialogue;
