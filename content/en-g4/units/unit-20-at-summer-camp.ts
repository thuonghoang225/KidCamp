import type { UnitInput } from "../../schema";

const ACTS = ["w.putting-up-a-tent", "w.building-a-campfire", "w.singing-songs", "w.telling-stories", "w.fishing", "w.playing-games"];

/** Unit 20 – At summer camp. */
const unit: UnitInput = {
  id: "u20",
  number: 20,
  title: "At summer camp",
  titleVi: "Ở trại hè",
  status: "ready",
  words: ACTS,
  patterns: [
    { id: "s.what-are-you-doing", question: "What are you doing?", answer: "I'm {act}.", meaning: "Bạn đang làm gì? – Mình đang …", slots: { act: ACTS }, acceptAlso: ["I am {act}."] },
    { id: "s.what-is-he-doing", question: "What's he doing?", answer: "He's {act}.", meaning: "Bạn ấy (nam) đang làm gì? – Bạn ấy đang …", slots: { act: ACTS }, acceptAlso: ["He is {act}."] },
    { id: "s.what-are-they-doing", question: "What are they doing?", answer: "They're {act}.", meaning: "Họ đang làm gì? – Họ đang …", slots: { act: ACTS }, acceptAlso: ["They are {act}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Hoạt động ở trại hè", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What are you doing?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Camp is fun", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ŋ/", hint: "âm cuối trong singing", target: ["singing", "fishing", "song", "king"], others: ["tent", "fun", "sun", "ten"] },
    { sound: "/æ/", hint: "như trong camp", target: ["camp", "cat", "hat", "map"], others: ["tent", "bed", "red", "pen"] },
  ],
  chant: {
    title: "Camp is fun",
    lines: [
      { text: "What are you doing? What are you doing?" },
      { text: "I'm putting up a tent, a tent, a tent!", gap: "putting up a tent" },
      { text: "What are they doing? What are they doing?" },
      { text: "They're singing songs around the campfire!", gap: "singing songs" },
    ],
  },
  editorNote: "Đối chiếu danh sách hoạt động ở trại hè với sách của bé.",
};

export default unit;
