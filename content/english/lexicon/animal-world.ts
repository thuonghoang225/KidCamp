import type { WordInput } from "../../schema";

/** Unit 19 (The animal world): trạng từ chỉ cách thức. */
const animalWorld: WordInput[] = [
  { id: "w.loudly", text: "loudly", meaning: "to, ầm ĩ", image: "art-loudly", level: "movers", topics: ["animals"], example: "The lion roars loudly." },
  { id: "w.quietly", text: "quietly", meaning: "khẽ, yên lặng", image: "art-quietly", level: "movers", topics: ["animals"], example: "The cat walks quietly." },
  { id: "w.quickly", text: "quickly", meaning: "nhanh", image: "art-quickly", level: "movers", topics: ["animals"], example: "The rabbit runs quickly." },
  { id: "w.slowly", text: "slowly", meaning: "chậm", image: "art-slowly", level: "movers", topics: ["animals"], example: "The elephant walks slowly." },
  { id: "w.beautifully", text: "beautifully", meaning: "đẹp", image: "art-beautifully", level: "movers", topics: ["animals"], example: "The peacock dances beautifully." },
  { id: "w.rabbit", text: "rabbit", meaning: "con thỏ", image: "rabbit", level: "starters", topics: ["animals"], example: "The rabbit runs quickly." },
  { id: "w.peacock", text: "peacock", meaning: "con công", image: "peacock", level: "textbook", topics: ["animals"], example: "The peacock dances beautifully." },
  { id: "w.cat", text: "cat", meaning: "con mèo", image: "cat", level: "starters", topics: ["animals"], example: "The cat walks quietly." },
];

export default animalWorld;
