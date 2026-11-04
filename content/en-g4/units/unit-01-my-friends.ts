import type { UnitInput as Unit } from "../../schema";

/**
 * Unit 1 – My friends (Tiếng Anh 4 Global Success, tập 1).
 * Từ vựng và mẫu câu lấy theo chương trình; chant là bài tự viết (không chép lời sách).
 */
const unit: Unit = {
  id: "u01",
  number: 1,
  title: "My friends",
  titleVi: "Bạn bè của em",
  status: "ready",
  words: [
    "w.viet-nam",
    "w.america",
    "w.australia",
    "w.britain",
    "w.japan",
    "w.malaysia",
    "w.singapore",
    "w.thailand",
  ],
  patterns: [
    {
      id: "s.where-are-you-from",
      question: "Where are you from?",
      answer: "I'm from {country}.",
      meaning: "Bạn đến từ đâu? – Mình đến từ …",
      slots: { country: ["w.viet-nam", "w.america", "w.australia", "w.britain", "w.japan", "w.malaysia", "w.singapore", "w.thailand"] },
      acceptAlso: ["I am from {country}.", "From {country}."],
    },
    {
      id: "s.where-is-she-from",
      question: "Where is she from?",
      answer: "She's from {country}.",
      meaning: "Bạn ấy (nữ) đến từ đâu? – Bạn ấy đến từ …",
      slots: { country: ["w.japan", "w.australia", "w.malaysia", "w.thailand"] },
      acceptAlso: ["She is from {country}."],
    },
    {
      id: "s.where-is-he-from",
      question: "Where is he from?",
      answer: "He's from {country}.",
      meaning: "Bạn ấy (nam) đến từ đâu? – Bạn ấy đến từ …",
      slots: { country: ["w.america", "w.britain", "w.singapore", "w.viet-nam"] },
      acceptAlso: ["He is from {country}."],
    },
    {
      id: "s.where-are-they-from",
      question: "Where are they from?",
      answer: "They're from {country}.",
      meaning: "Họ đến từ đâu? – Họ đến từ …",
      slots: { country: ["w.singapore", "w.america", "w.japan"] },
      acceptAlso: ["They are from {country}."],
    },
    {
      id: "s.nice-to-meet-you",
      question: "Nice to meet you.",
      answer: "Nice to meet you, too.",
      meaning: "Rất vui được gặp bạn. – Mình cũng rất vui được gặp bạn.",
      slots: {},
      acceptAlso: ["Nice to meet you too."],
    },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Tên các nước", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Where are you from?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Hello, where are you from?", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    {
      sound: "/ɪə/",
      hint: "như trong here",
      target: ["here", "ear", "year", "hear"],
      others: ["teacher", "farmer", "singer", "mother"],
    },
    {
      sound: "/ə/",
      hint: "âm cuối nhẹ trong teacher",
      target: ["teacher", "farmer", "singer", "brother"],
      others: ["here", "ear", "year", "near"],
    },
  ],
  chant: {
    title: "Hello, where are you from?",
    lines: [
      { text: "Hello, hello, where are you from?" },
      { text: "I'm from Viet Nam, Viet Nam!", gap: "Viet Nam" },
      { text: "Hello, hello, where is she from?" },
      { text: "She's from Japan, Japan!", gap: "Japan" },
      { text: "Hello, hello, where is he from?" },
      { text: "He's from Britain, Britain!", gap: "Britain" },
      { text: "Nice to meet you, nice to meet you!" },
      { text: "Nice to meet you, too!", gap: "too" },
    ],
  },
  editorNote:
    "Đối chiếu danh sách nước, mẫu câu Lesson 2 và phần âm Lesson 3 với sách của bé; sửa trực tiếp file này nếu khác.",
};

export default unit;
