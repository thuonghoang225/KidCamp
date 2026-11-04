import type { WordInput } from "../../schema";

/** Unit 5 (Things we can do): những việc em làm được. */
const abilities: WordInput[] = [
  { id: "w.swim", text: "swim", meaning: "bơi", image: "art-swim", level: "starters", topics: ["sports"], example: "I can swim." },
  { id: "w.ride-a-bike", text: "ride a bike", meaning: "đi xe đạp", image: "art-ride-a-bike", level: "starters", topics: ["sports", "transport"], example: "I can ride a bike." },
  { id: "w.play-the-guitar", text: "play the guitar", meaning: "chơi đàn ghi-ta", image: "art-play-the-guitar", level: "starters", topics: ["leisure"], example: "She can play the guitar." },
  { id: "w.draw", text: "draw", meaning: "vẽ", image: "art-draw", level: "starters", topics: ["school"], example: "He can draw a cat." },
  { id: "w.dance", text: "dance", meaning: "nhảy múa", image: "art-dance", level: "starters", topics: ["leisure"], example: "We can dance." },
  { id: "w.sing", text: "sing", meaning: "hát", image: "art-sing", level: "starters", topics: ["leisure"], example: "I can sing a song." },
  { id: "w.skate", text: "skate", meaning: "trượt pa-tanh", image: "art-skate", level: "movers", topics: ["sports"], example: "Can you skate?" },
  { id: "w.cook", text: "cook", meaning: "nấu ăn", image: "art-cook", level: "movers", topics: ["food"], example: "My mother can cook well." },
  { id: "w.play-chess", text: "play chess", meaning: "chơi cờ vua", image: "art-play-chess", level: "textbook", topics: ["leisure"], example: "My brother can play chess." },
];

export default abilities;
