import type { WordInput } from "../../schema";

/** Unit 17 (In the city): phương tiện và địa điểm. */
const city: WordInput[] = [
  { id: "w.bus", text: "bus", meaning: "xe buýt", image: "art-bus", level: "starters", topics: ["transport"], example: "I go to school by bus." },
  { id: "w.car", text: "car", meaning: "ô tô", image: "art-car", level: "starters", topics: ["transport"], example: "We go by car." },
  { id: "w.bike", text: "bike", meaning: "xe đạp", image: "art-bike", level: "starters", topics: ["transport"], example: "You can go by bike." },
  { id: "w.motorbike", text: "motorbike", meaning: "xe máy", image: "art-motorbike", level: "movers", topics: ["transport"], example: "My dad goes to work by motorbike." },
  { id: "w.train", text: "train", meaning: "tàu hỏa", image: "art-train", level: "starters", topics: ["transport"], example: "They go to Hue by train." },
  { id: "w.post-office", text: "post office", meaning: "bưu điện", image: "art-post-office", level: "movers", topics: ["city"], example: "The post office is near the park." },
  { id: "w.bus-stop", text: "bus stop", meaning: "điểm dừng xe buýt", image: "art-bus-stop", level: "movers", topics: ["city", "transport"], example: "Let's wait at the bus stop." },
];

export default city;
