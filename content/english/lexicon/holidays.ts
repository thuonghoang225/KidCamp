import type { WordInput } from "../../schema";

/** Unit 10 (Our summer holidays): nơi chốn, dùng với "I was at the …". */
const holidays: WordInput[] = [
  { id: "w.beach", text: "beach", meaning: "bãi biển", image: "beach-with-umbrella", level: "starters", topics: ["world"], example: "I was at the beach." },
  { id: "w.zoo", text: "zoo", meaning: "sở thú", image: "lion", level: "starters", topics: ["world", "animals"], example: "We were at the zoo." },
  { id: "w.museum", text: "museum", meaning: "bảo tàng", image: "classical-building", level: "movers", topics: ["world"], example: "I was at the museum." },
  { id: "w.campsite", text: "campsite", meaning: "khu cắm trại", image: "camping", level: "textbook", topics: ["world"], example: "We were at the campsite." },
  { id: "w.park", text: "park", meaning: "công viên", image: "national-park", level: "starters", topics: ["world"], example: "I was at the park." },
  { id: "w.funfair", text: "funfair", meaning: "khu vui chơi", image: "ferris-wheel", level: "movers", topics: ["world"], example: "We were at the funfair." },
  { id: "w.summer", text: "summer", meaning: "mùa hè", image: "beach-with-umbrella", level: "movers", topics: ["time"], pictureable: false },
];

export default holidays;
