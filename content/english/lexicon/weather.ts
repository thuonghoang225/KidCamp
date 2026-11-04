import type { WordInput } from "../../schema";

/** Unit 16 (Weather). */
const weather: WordInput[] = [
  { id: "w.sunny", text: "sunny", meaning: "có nắng", image: "art-sunny", level: "starters", topics: ["weather"], example: "It's sunny today." },
  { id: "w.rainy", text: "rainy", meaning: "có mưa", image: "art-rainy", level: "movers", topics: ["weather"], example: "It's rainy in Ha Noi." },
  { id: "w.cloudy", text: "cloudy", meaning: "nhiều mây", image: "art-cloudy", level: "movers", topics: ["weather"], example: "It's cloudy this morning." },
  { id: "w.windy", text: "windy", meaning: "có gió", image: "art-windy", level: "movers", topics: ["weather"], example: "It's windy. Let's fly a kite!" },
  { id: "w.snowy", text: "snowy", meaning: "có tuyết", image: "art-snowy", level: "movers", topics: ["weather"], example: "It's snowy in Japan." },
  { id: "w.hot", text: "hot", meaning: "nóng", image: "art-hot", level: "starters", topics: ["weather"], example: "It's hot in summer." },
  { id: "w.cold", text: "cold", meaning: "lạnh", image: "art-cold", level: "starters", topics: ["weather"], example: "It's cold in winter." },
];

export default weather;
