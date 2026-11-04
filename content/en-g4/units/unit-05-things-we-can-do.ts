import type { UnitInput } from "../../schema";

const ACTIONS = ["w.swim", "w.ride-a-bike", "w.play-the-guitar", "w.draw", "w.dance", "w.sing", "w.skate", "w.cook", "w.play-chess"];

/** Unit 5 – Things we can do. */
const unit: UnitInput = {
  id: "u05",
  number: 5,
  title: "Things we can do",
  titleVi: "Những việc chúng ta làm được",
  status: "ready",
  words: ACTIONS,
  patterns: [
    { id: "s.can-you", question: "Can you {action}?", answer: "Yes, I can.", meaning: "Bạn có … được không? – Có, mình làm được. / Không, mình không làm được.", slots: { action: ACTIONS }, acceptAlso: ["No, I can't.", "Yes.", "No."] },
    { id: "s.what-can-you-do", question: "What can you do?", answer: "I can {action}.", meaning: "Bạn làm được gì? – Mình có thể …", slots: { action: ACTIONS }, acceptAlso: [] },
    { id: "s.what-can-she-do", question: "What can she do?", answer: "She can {action}.", meaning: "Bạn ấy (nữ) làm được gì?", slots: { action: ["w.dance", "w.sing", "w.draw", "w.play-the-guitar"] }, acceptAlso: ["She is able to {action}."] },
    { id: "s.what-can-he-do", question: "What can he do?", answer: "He can {action}.", meaning: "Bạn ấy (nam) làm được gì?", slots: { action: ["w.ride-a-bike", "w.skate", "w.play-chess", "w.cook"] }, acceptAlso: [] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Những việc em làm được", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Can you swim?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Yes, I can!", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/æ/", hint: "như trong can", target: ["can", "cat", "hat", "bag"], others: ["cake", "name", "play", "skate"] },
    { sound: "/aɪ/", hint: "như trong bike", target: ["bike", "ride", "kite", "nice"], others: ["swim", "sing", "fish", "milk"] },
  ],
  chant: {
    title: "Yes, I can!",
    lines: [
      { text: "Can you swim? Yes, I can!", gap: "Yes, I can" },
      { text: "Can you dance? Yes, I can!", gap: "Yes, I can" },
      { text: "Can you skate? No, I can't." },
      { text: "But I can ride a bike, look at me!", gap: "ride a bike" },
    ],
  },
  editorNote: "Danh sách hoạt động soạn theo chủ đề và mẫu câu Can you…?; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
