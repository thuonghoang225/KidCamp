import type { UnitInput } from "../../schema";

const HE_JOBS = ["w.doctor", "w.farmer", "w.driver", "w.worker"];
const SHE_JOBS = ["w.teacher", "w.nurse", "w.singer"];
const WORKPLACES = ["w.hospital", "w.factory", "w.office"];

/** Unit 12 – Jobs. */
const unit: UnitInput = {
  id: "u12",
  number: 12,
  title: "Jobs",
  titleVi: "Nghề nghiệp",
  status: "ready",
  words: [...SHE_JOBS, ...HE_JOBS, ...WORKPLACES],
  patterns: [
    { id: "s.what-does-your-father-do", question: "What does your father do?", answer: "He's a {job}.", meaning: "Bố bạn làm nghề gì? – Bố mình là …", slots: { job: HE_JOBS }, acceptAlso: ["He is a {job}."] },
    { id: "s.what-does-your-mother-do", question: "What does your mother do?", answer: "She's a {job}.", meaning: "Mẹ bạn làm nghề gì? – Mẹ mình là …", slots: { job: SHE_JOBS }, acceptAlso: ["She is a {job}."] },
    { id: "s.where-does-he-work", question: "Where does he work?", answer: "He works in a {place}.", meaning: "Ông ấy làm việc ở đâu? – Ông ấy làm việc ở …", slots: { place: WORKPLACES }, acceptAlso: ["In a {place}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Các nghề", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What does your father do?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Who are they?", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɜː/", hint: "như trong nurse", target: ["nurse", "work", "girl", "bird"], others: ["doctor", "farmer", "father", "teacher"] },
    { sound: "/ɒ/", hint: "như trong doctor", target: ["doctor", "shop", "job", "hot"], others: ["nurse", "work", "her", "first"] },
  ],
  chant: {
    title: "Who are they?",
    lines: [
      { text: "What does your father do?" },
      { text: "He's a doctor, a doctor, a doctor!", gap: "doctor" },
      { text: "What does your mother do?" },
      { text: "She's a teacher, a teacher, a teacher!", gap: "teacher" },
      { text: "Where does he work? In a hospital!", gap: "hospital" },
    ],
  },
  editorNote: "Đối chiếu danh sách nghề và nơi làm việc với sách của bé.",
};

export default unit;
