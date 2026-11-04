import type { WordInput } from "../../schema";

/** Unit 9 (Our sports day). */
const sportsDay: WordInput[] = [
  { id: "w.badminton", text: "badminton", meaning: "cầu lông", image: "art-badminton", level: "movers", topics: ["sports"], example: "I play badminton." },
  { id: "w.table-tennis", text: "table tennis", meaning: "bóng bàn", image: "art-table-tennis", level: "starters", topics: ["sports"], example: "We play table tennis." },
  { id: "w.basketball", text: "basketball", meaning: "bóng rổ", image: "art-basketball", level: "starters", topics: ["sports"], example: "He plays basketball." },
  { id: "w.volleyball", text: "volleyball", meaning: "bóng chuyền", image: "art-volleyball", level: "starters", topics: ["sports"], example: "They play volleyball." },
  { id: "w.running", text: "running", meaning: "chạy", image: "art-running", level: "textbook", topics: ["sports"], example: "Running is good for you." },
  { id: "w.sports-day", text: "sports day", meaning: "ngày hội thể thao", image: "art-sports-day", level: "textbook", topics: ["school", "sports"], example: "Our sports day is in June." },
];

export default sportsDay;
