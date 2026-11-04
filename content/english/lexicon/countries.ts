import type { WordInput as Word } from "../../schema";

/** Tên nước dùng trong Unit 1 (My friends) và chủ đề "The world around us". */
const countries: Word[] = [
  { id: "w.viet-nam", text: "Viet Nam", meaning: "Việt Nam", image: "flag-vn", level: "textbook", topics: ["world"], example: "I'm from Viet Nam." },
  { id: "w.america", text: "America", meaning: "nước Mỹ", image: "flag-us", level: "textbook", topics: ["world"], example: "Ben is from America." },
  { id: "w.australia", text: "Australia", meaning: "nước Úc", image: "flag-au", level: "textbook", topics: ["world"], example: "She's from Australia." },
  { id: "w.britain", text: "Britain", meaning: "nước Anh", image: "flag-gb", level: "textbook", topics: ["world"], example: "He's from Britain." },
  { id: "w.japan", text: "Japan", meaning: "Nhật Bản", image: "flag-jp", level: "textbook", topics: ["world"], example: "Miko is from Japan." },
  { id: "w.malaysia", text: "Malaysia", meaning: "Ma-lai-xi-a", image: "flag-my", level: "textbook", topics: ["world"], example: "I'm from Malaysia." },
  { id: "w.singapore", text: "Singapore", meaning: "Xin-ga-po", image: "flag-sg", level: "textbook", topics: ["world"], example: "They're from Singapore." },
  { id: "w.thailand", text: "Thailand", meaning: "Thái Lan", image: "flag-th", level: "textbook", topics: ["world"], example: "He's from Thailand." },
];

export default countries;
