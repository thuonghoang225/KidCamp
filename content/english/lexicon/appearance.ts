import type { WordInput } from "../../schema";

/** Unit 13 (Appearance). Tính từ khó vẽ: bài tập hiện chữ thay hình. */
const appearance: WordInput[] = [
  { id: "w.tall", text: "tall", meaning: "cao", image: "art-tall", level: "movers", topics: ["appearance"], example: "My father is tall." },
  { id: "w.short", text: "short", meaning: "thấp", image: "art-short", level: "movers", topics: ["appearance"], example: "My sister is short." },
  { id: "w.slim", text: "slim", meaning: "mảnh khảnh", image: "art-slim", level: "textbook", topics: ["appearance"] },
  { id: "w.big", text: "big", meaning: "to, lớn", image: "art-big", level: "starters", topics: ["appearance"] },
  { id: "w.young", text: "young", meaning: "trẻ", image: "art-young", level: "movers", topics: ["appearance"] },
  { id: "w.old", text: "old", meaning: "già", image: "art-old", level: "starters", topics: ["appearance"] },
  { id: "w.brother", text: "brother", meaning: "anh, em trai", image: "art-brother", level: "starters", topics: ["family"], example: "My brother is tall." },
  { id: "w.sister", text: "sister", meaning: "chị, em gái", image: "art-sister", level: "starters", topics: ["family"], example: "My sister is young." },
];

export default appearance;
