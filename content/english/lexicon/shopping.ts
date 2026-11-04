import type { WordInput } from "../../schema";

/** Unit 18 (At the shopping centre): quần áo và giá tiền. */
const shopping: WordInput[] = [
  { id: "w.t-shirt", text: "T-shirt", meaning: "áo phông", image: "art-t-shirt", level: "starters", topics: ["clothes"], example: "I'd like a T-shirt." },
  { id: "w.hat", text: "hat", meaning: "cái mũ", image: "art-hat", level: "starters", topics: ["clothes"], example: "How much is the hat?" },
  { id: "w.dress", text: "dress", meaning: "váy liền", image: "art-dress", level: "starters", topics: ["clothes"], example: "The dress is beautiful." },
  { id: "w.skirt", text: "skirt", meaning: "chân váy", image: "art-skirt", level: "starters", topics: ["clothes"], example: "I like this skirt." },
  { id: "w.shoes", text: "shoes", meaning: "đôi giày", image: "art-shoes", level: "starters", topics: ["clothes"], example: "How much are the shoes?" },
  { id: "w.jeans", text: "jeans", meaning: "quần bò", image: "art-jeans", level: "starters", topics: ["clothes"], example: "These jeans are blue." },
  { id: "w.fifty-thousand", text: "fifty thousand", meaning: "năm mươi nghìn", image: "price-50", level: "textbook", topics: ["numbers"] },
  { id: "w.eighty-thousand", text: "eighty thousand", meaning: "tám mươi nghìn", image: "price-80", level: "textbook", topics: ["numbers"] },
  { id: "w.one-hundred-thousand", text: "one hundred thousand", meaning: "một trăm nghìn", image: "price-100", level: "textbook", topics: ["numbers"] },
  { id: "w.two-hundred-thousand", text: "two hundred thousand", meaning: "hai trăm nghìn", image: "price-200", level: "textbook", topics: ["numbers"] },
];

export default shopping;
