import type { UnitInput } from "../../schema";

const WEATHER = ["w.sunny", "w.rainy", "w.cloudy", "w.windy", "w.snowy", "w.hot", "w.cold"];

/** Unit 16 – Weather. Mẫu câu theo chương trình; chant, hội thoại do KidCamp tự viết. */
const unit: UnitInput = {
  id: "u16",
  number: 16,
  title: "Weather",
  titleVi: "Thời tiết",
  status: "ready",
  words: WEATHER,
  patterns: [
    { id: "s.whats-the-weather-like", question: "What's the weather like today?", answer: "It's {weather}.", meaning: "Hôm nay thời tiết thế nào? – Trời …", slots: { weather: WEATHER }, acceptAlso: ["It is {weather}.", "It's {weather} today.", "{weather}."] },
    { id: "s.is-it-weather-today", question: "Is it {weather} today?", answer: "Yes, it is.", meaning: "Hôm nay trời có … không? – Có. / Không.", slots: { weather: WEATHER }, acceptAlso: ["No, it isn't.", "No, it is not.", "Yes.", "No."] },
    { id: "s.weather-in-city", question: "What's the weather like in Ha Noi?", answer: "It's {weather} in Ha Noi.", meaning: "Thời tiết ở Hà Nội thế nào? – Ở Hà Nội trời …", slots: { weather: ["w.sunny", "w.rainy", "w.cloudy", "w.hot", "w.cold"] }, acceptAlso: ["It's {weather}.", "It is {weather}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Nắng, mưa, gió", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What's the weather like?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Weather song", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ʌ/", hint: "như trong sunny", target: ["sunny", "cup", "bus", "fun"], others: ["cloudy", "cold", "snow", "rain"] },
    { sound: "/aʊ/", hint: "như trong cloudy", target: ["cloudy", "down", "town", "house"], others: ["sunny", "windy", "rainy", "snowy"] },
  ],
  chant: {
    title: "Weather song",
    lines: [
      { text: "What's the weather like today?" },
      { text: "It's sunny, sunny, let's go and play!", gap: "sunny" },
      { text: "What's the weather like today?" },
      { text: "It's rainy, rainy, stay in and stay!", gap: "rainy" },
    ],
  },
  editorNote: "Đối chiếu danh sách từ thời tiết và mẫu câu với sách của bé.",
};

export default unit;
