import type { UnitInput } from "../../schema";

const PARTS = ["w.morning", "w.afternoon", "w.evening"];
const ACTS = ["w.wash-the-dishes", "w.clean-the-floor", "w.read-books", "w.play-games", "w.watch-tv", "w.do-homework"];

/** Unit 14 – Daily activities. */
const unit: UnitInput = {
  id: "u14",
  number: 14,
  title: "Daily activities",
  titleVi: "Hoạt động hằng ngày",
  status: "ready",
  words: [...PARTS, ...ACTS],
  patterns: [
    { id: "s.what-do-you-do-in-the", question: "What do you do in the {part}?", answer: "I {act}.", meaning: "Bạn làm gì vào buổi …? – Mình …", slots: { part: PARTS, act: ACTS }, acceptAlso: ["I {act} in the {part}."] },
    { id: "s.when-do-you-act", question: "When do you {act}?", answer: "I do it in the {part}.", meaning: "Bạn … khi nào? – Mình làm việc đó vào buổi …", slots: { act: ACTS, part: PARTS }, acceptAlso: ["I {act} in the {part}.", "In the {part}."] },
    { id: "s.do-you-act", question: "Do you {act} in the evening?", answer: "Yes, I do.", meaning: "Buổi tối bạn có … không? – Có. / Không.", slots: { act: ACTS }, acceptAlso: ["No, I don't.", "No, I do not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Việc nhà và thời gian trong ngày", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What do you do in the morning?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Every day", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ʃ/", hint: "như trong wash", target: ["wash", "dish", "shop", "she"], others: ["chair", "lunch", "watch", "cheese"] },
    { sound: "/tʃ/", hint: "như trong watch", target: ["watch", "lunch", "chair", "teacher"], others: ["wash", "dish", "shoe", "fish"] },
  ],
  chant: {
    title: "Every day",
    lines: [
      { text: "What do you do in the morning?" },
      { text: "I read books, I read books!", gap: "read books" },
      { text: "What do you do in the evening?" },
      { text: "I wash the dishes, splash splash splash!", gap: "wash the dishes" },
    ],
  },
  editorNote: "Sách dùng ngôi thứ ba (When does Max …?); KidCamp cho bé luyện ngôi thứ nhất trước. Đối chiếu danh sách hoạt động với sách.",
};

export default unit;
