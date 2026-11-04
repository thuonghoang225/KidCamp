import type { DialogueInput } from "../../schema";

const dialogue: DialogueInput = {
  id: "d.u03.weekend",
  courseId: "en-g4",
  unitId: "u03",
  title: "My weekend",
  titleVi: "Cuối tuần của em",
  friend: { name: "Lucy", country: "Australia" },
  turns: [
    { say: "Hello! What day is it today?", expectPattern: "s.what-day-is-it", hints: ["It's Friday.", "It's …", "It's …"] },
    { say: "Yay, the weekend is coming! What do you do on Saturdays?", expectPattern: "s.what-do-you-do-on-saturdays", hints: ["I watch TV on Saturdays.", "I … on Saturdays.", "I …"] },
    { say: "Nice! What do you do on Sundays?", expectPattern: "s.what-do-you-do-on-sundays", hints: ["I play football on Sundays.", "I … on Sundays.", "I …"] },
    { say: "Cool! I go swimming on Sundays. Have a good weekend!" },
  ],
};

export default dialogue;
