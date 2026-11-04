import type { WordInput } from "../../schema";

/** Unit 14 (Daily activities). */
const daily: WordInput[] = [
  { id: "w.morning", text: "morning", meaning: "buổi sáng", image: "art-morning", level: "starters", topics: ["time"] },
  { id: "w.afternoon", text: "afternoon", meaning: "buổi chiều", image: "art-afternoon", level: "starters", topics: ["time"] },
  { id: "w.evening", text: "evening", meaning: "buổi tối", image: "art-evening", level: "starters", topics: ["time"] },
  { id: "w.wash-the-dishes", text: "wash the dishes", meaning: "rửa bát", image: "art-wash-the-dishes", level: "textbook", topics: ["home"] },
  { id: "w.clean-the-floor", text: "clean the floor", meaning: "lau nhà", image: "art-clean-the-floor", level: "textbook", topics: ["home"] },
  { id: "w.read-books", text: "read books", meaning: "đọc sách", image: "art-read-books", level: "starters", topics: ["home"] },
  { id: "w.play-games", text: "play games", meaning: "chơi trò chơi", image: "art-play-games", level: "starters", topics: ["home"] },
];

export default daily;
