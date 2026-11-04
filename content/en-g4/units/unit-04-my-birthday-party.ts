import type { UnitInput } from "../../schema";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map((m) => `w.${m}`);
const FOOD = ["w.cake", "w.chips", "w.pizza", "w.sweets"];
const DRINKS = ["w.juice", "w.milk"];

/** Unit 4 – My birthday party. */
const unit: UnitInput = {
  id: "u04",
  number: 4,
  title: "My birthday party",
  titleVi: "Tiệc sinh nhật của em",
  status: "ready",
  words: [...MONTHS, ...FOOD, "w.burger", ...DRINKS],
  patterns: [
    { id: "s.when-is-your-birthday", question: "When's your birthday?", answer: "It's in {month}.", meaning: "Sinh nhật bạn vào tháng nào? – Vào tháng …", slots: { month: MONTHS }, acceptAlso: ["It is in {month}.", "In {month}.", "My birthday is in {month}."] },
    { id: "s.what-would-you-like-to-eat", question: "What would you like to eat?", answer: "I'd like some {food}.", meaning: "Bạn muốn ăn gì? – Mình muốn ăn …", slots: { food: FOOD }, acceptAlso: ["I would like some {food}.", "Some {food}, please."] },
    { id: "s.what-would-you-like-to-drink", question: "What would you like to drink?", answer: "I'd like some {drink}.", meaning: "Bạn muốn uống gì? – Mình muốn uống …", slots: { drink: DRINKS }, acceptAlso: ["I would like some {drink}.", "Some {drink}, please."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Tháng, đồ ăn, đồ uống", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "When's your birthday?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Party time!", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɜː/", hint: "như trong birthday", target: ["birthday", "first", "third", "girl"], others: ["party", "card", "car", "star"] },
    { sound: "/ɑː/", hint: "như trong party", target: ["party", "card", "car", "star"], others: ["birthday", "first", "girl", "shirt"] },
  ],
  chant: {
    title: "Party time!",
    lines: [
      { text: "When's your birthday? When's your birthday?" },
      { text: "It's in June! It's in June!", gap: "June" },
      { text: "What would you like to eat?" },
      { text: "I'd like some cake, yummy, yummy cake!", gap: "cake" },
      { text: "What would you like to drink?" },
      { text: "I'd like some juice, let's have fun!", gap: "juice" },
    ],
  },
  editorNote: "Danh sách đồ ăn, đồ uống soạn theo chủ đề; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
