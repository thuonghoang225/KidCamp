import type { WordInput } from "../../schema";

/** Unit 20 (At summer camp): hoạt động đang diễn ra (-ing). */
const camp: WordInput[] = [
  { id: "w.putting-up-a-tent", text: "putting up a tent", meaning: "dựng lều", image: "art-putting-up-a-tent", level: "textbook", topics: ["camp"] },
  { id: "w.building-a-campfire", text: "building a campfire", meaning: "đốt lửa trại", image: "art-building-a-campfire", level: "textbook", topics: ["camp"] },
  { id: "w.singing-songs", text: "singing songs", meaning: "hát", image: "art-singing-songs", level: "textbook", topics: ["camp"] },
  { id: "w.telling-stories", text: "telling stories", meaning: "kể chuyện", image: "art-telling-stories", level: "textbook", topics: ["camp"] },
  { id: "w.fishing", text: "fishing", meaning: "câu cá", image: "art-fishing", level: "movers", topics: ["camp"] },
  { id: "w.playing-games", text: "playing games", meaning: "chơi trò chơi", image: "art-playing-games", level: "textbook", topics: ["camp"] },
];

export default camp;
