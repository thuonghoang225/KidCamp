import type { UnitInput } from "../../schema";

const ONE = ["w.t-shirt", "w.hat", "w.dress", "w.skirt"];
const PAIR = ["w.shoes", "w.jeans"];
const PRICES = ["w.fifty-thousand", "w.eighty-thousand", "w.one-hundred-thousand", "w.two-hundred-thousand"];

/** Unit 18 – At the shopping centre. */
const unit: UnitInput = {
  id: "u18",
  number: 18,
  title: "At the shopping centre",
  titleVi: "Ở trung tâm thương mại",
  status: "ready",
  words: [...ONE, ...PAIR, ...PRICES],
  patterns: [
    { id: "s.how-much-is-the", question: "How much is the {item}?", answer: "It's {price} dong.", meaning: "Cái … giá bao nhiêu? – Giá … đồng.", slots: { item: ONE, price: PRICES }, acceptAlso: ["It is {price} dong.", "{price} dong."] },
    { id: "s.how-much-are-the", question: "How much are the {item}?", answer: "They're {price} dong.", meaning: "Đôi/chiếc … giá bao nhiêu? – Giá … đồng.", slots: { item: PAIR, price: PRICES }, acceptAlso: ["They are {price} dong.", "{price} dong."] },
    { id: "s.what-would-you-like-to-buy", question: "What would you like to buy?", answer: "I'd like a {item}.", meaning: "Bạn muốn mua gì? – Mình muốn mua …", slots: { item: ONE }, acceptAlso: ["I would like a {item}.", "A {item}, please."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Quần áo và giá tiền", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "How much is the hat?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Shopping time", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ʃ/", hint: "như trong shoes", target: ["shoes", "shirt", "shop", "fish"], others: ["skirt", "socks", "dress", "jeans"] },
    { sound: "/dʒ/", hint: "như trong jeans", target: ["jeans", "jacket", "juice", "June"], others: ["shoes", "shirt", "she", "shop"] },
  ],
  chant: {
    title: "Shopping time",
    lines: [
      { text: "How much is the hat? How much is the hat?" },
      { text: "It's fifty thousand dong. I like that!", gap: "fifty thousand" },
      { text: "How much are the shoes? How much are the shoes?" },
      { text: "They're two hundred thousand. Red or blue?", gap: "two hundred thousand" },
    ],
  },
  editorNote: "Giá tiền là ví dụ; đối chiếu đồ vật và cách đọc giá với sách của bé.",
};

export default unit;
