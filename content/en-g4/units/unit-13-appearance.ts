import type { UnitInput } from "../../schema";

const HE = ["w.tall", "w.big", "w.old", "w.young"];
const SHE = ["w.short", "w.slim", "w.young", "w.tall"];
const ALL = ["w.tall", "w.short", "w.slim", "w.big", "w.young", "w.old"];

/** Unit 13 – Appearance. */
const unit: UnitInput = {
  id: "u13",
  number: 13,
  title: "Appearance",
  titleVi: "Ngoại hình",
  status: "ready",
  words: [...ALL, "w.brother", "w.sister"],
  patterns: [
    { id: "s.what-does-he-look-like", question: "What does he look like?", answer: "He's {look}.", meaning: "Anh ấy trông thế nào? – Anh ấy …", slots: { look: HE }, acceptAlso: ["He is {look}."] },
    { id: "s.what-does-she-look-like", question: "What does she look like?", answer: "She's {look}.", meaning: "Cô ấy trông thế nào? – Cô ấy …", slots: { look: SHE }, acceptAlso: ["She is {look}."] },
    { id: "s.is-your-brother", question: "Is your brother {look}?", answer: "Yes, he is.", meaning: "Anh/em trai bạn có … không? – Có. / Không.", slots: { look: ["w.tall", "w.short", "w.slim", "w.big"] }, acceptAlso: ["No, he isn't.", "No, he is not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Cao, thấp, già, trẻ", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What does he look like?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Tall and short", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɔː/", hint: "như trong tall", target: ["tall", "short", "ball", "small"], others: ["old", "go", "slim", "big"] },
    { sound: "/əʊ/", hint: "như trong old", target: ["old", "go", "home", "slow"], others: ["tall", "short", "ball", "young"] },
  ],
  chant: {
    title: "Tall and short",
    lines: [
      { text: "What does he look like? What does he look like?" },
      { text: "He's tall, tall, tall like a tree!", gap: "tall" },
      { text: "What does she look like? What does she look like?" },
      { text: "She's short, short, short like me!", gap: "short" },
    ],
  },
  editorNote: "Đối chiếu tính từ miêu tả ngoại hình với sách của bé.",
};

export default unit;
