import type { UnitInput } from "../../schema";

const PLACES = ["w.beach", "w.zoo", "w.museum", "w.campsite", "w.park", "w.funfair"];

/** Unit 10 – Our summer holidays. */
const unit: UnitInput = {
  id: "u10",
  number: 10,
  title: "Our summer holidays",
  titleVi: "Kỳ nghỉ hè của chúng em",
  status: "ready",
  words: [...PLACES, "w.summer"],
  patterns: [
    { id: "s.where-were-you-last-summer", question: "Where were you last summer?", answer: "I was at the {place}.", meaning: "Hè năm ngoái bạn ở đâu? – Mình ở …", slots: { place: PLACES }, acceptAlso: ["At the {place}.", "I was at the {place} last summer."] },
    { id: "s.were-you-at-the", question: "Were you at the {place} last weekend?", answer: "Yes, I was.", meaning: "Cuối tuần trước bạn có ở … không? – Có. / Không.", slots: { place: PLACES }, acceptAlso: ["No, I wasn't.", "No, I was not.", "Yes.", "No."] },
    { id: "s.where-was-she", question: "Where was she last summer?", answer: "She was at the {place}.", meaning: "Hè năm ngoái bạn ấy (nữ) ở đâu?", slots: { place: PLACES }, acceptAlso: ["At the {place}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Những nơi đi chơi", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Where were you last summer?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Last summer", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/iː/", hint: "như trong beach", target: ["beach", "sea", "week", "tree"], others: ["sit", "big", "swim", "fish"] },
    { sound: "/uː/", hint: "như trong zoo", target: ["zoo", "June", "blue", "too"], others: ["book", "look", "good", "foot"] },
  ],
  chant: {
    title: "Last summer",
    lines: [
      { text: "Where were you last summer?" },
      { text: "I was at the beach, the sunny, sunny beach!", gap: "beach" },
      { text: "Were you at the zoo? Yes, I was!", gap: "Yes, I was" },
      { text: "Summer, summer, fun, fun, fun!" },
    ],
  },
  editorNote: "Danh sách nơi chốn soạn theo mẫu câu Where were you…?; đối chiếu với sách.",
};

export default unit;
