import type { WordInput } from "../../schema";

/** Unit 11 (My home). */
const home: WordInput[] = [
  { id: "w.house", text: "house", meaning: "ngôi nhà", image: "art-house", level: "starters", topics: ["home"], example: "I live in a house." },
  { id: "w.flat", text: "flat", meaning: "căn hộ", image: "art-flat", level: "movers", topics: ["home"], example: "We live in a flat." },
  { id: "w.street", text: "street", meaning: "đường phố", image: "art-street", level: "starters", topics: ["home", "city"], example: "My street is quiet." },
  { id: "w.village", text: "village", meaning: "làng quê", image: "art-village", level: "movers", topics: ["home"], example: "My grandma lives in a village." },
  { id: "w.busy", text: "busy", meaning: "đông đúc, nhộn nhịp", image: "art-busy", level: "movers", topics: ["home", "city"] },
  { id: "w.quiet", text: "quiet", meaning: "yên tĩnh", image: "art-quiet", level: "movers", topics: ["home", "city"] },
  { id: "w.noisy", text: "noisy", meaning: "ồn ào", image: "art-noisy", level: "movers", topics: ["home", "city"] },
  { id: "w.beautiful", text: "beautiful", meaning: "đẹp", image: "art-beautiful", level: "starters", topics: ["home"] },
];

export default home;
