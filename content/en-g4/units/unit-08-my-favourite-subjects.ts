import type { UnitInput } from "../../schema";

const SUBJECTS = ["w.maths", "w.english", "w.vietnamese", "w.science", "w.art", "w.music", "w.pe", "w.it"];
const REASONS = ["w.fun", "w.interesting", "w.easy"];

/** Unit 8 – My favourite subjects. */
const unit: UnitInput = {
  id: "u08",
  number: 8,
  title: "My favourite subjects",
  titleVi: "Môn học yêu thích",
  status: "ready",
  words: [...SUBJECTS, ...REASONS],
  patterns: [
    { id: "s.favourite-subject", question: "What's your favourite subject?", answer: "It's {subject}.", meaning: "Môn học yêu thích của bạn là gì? – Là môn …", slots: { subject: SUBJECTS }, acceptAlso: ["It is {subject}.", "My favourite subject is {subject}.", "I like {subject}.", "{subject}."] },
    { id: "s.why-do-you-like", question: "Why do you like {subject}?", answer: "Because it's {reason}.", meaning: "Vì sao bạn thích môn …? – Vì nó …", slots: { subject: SUBJECTS, reason: REASONS }, acceptAlso: ["Because it is {reason}.", "It's {reason}.", "It is {reason}."] },
    { id: "s.do-you-like", question: "Do you like {subject}?", answer: "Yes, I do.", meaning: "Bạn có thích môn … không? – Có. / Không.", slots: { subject: SUBJECTS }, acceptAlso: ["No, I don't.", "No, I do not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Môn học và lý do", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What's your favourite subject?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "I like Science", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/aɪ/", hint: "như trong like", target: ["like", "Science", "why", "my"], others: ["it", "is", "this", "big"] },
    { sound: "/juː/", hint: "như trong music", target: ["music", "computer", "cute", "use"], others: ["but", "fun", "run", "sun"] },
  ],
  chant: {
    title: "I like Science",
    lines: [
      { text: "What's your favourite subject?" },
      { text: "It's Science, it's Science!", gap: "Science" },
      { text: "Why do you like Science?" },
      { text: "Because it's interesting, so interesting!", gap: "interesting" },
    ],
  },
  editorNote: "Lý do (fun, interesting, easy) soạn theo mẫu câu Why do you like…?; đối chiếu với sách.",
};

export default unit;
