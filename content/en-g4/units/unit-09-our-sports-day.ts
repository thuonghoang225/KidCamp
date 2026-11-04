import type { UnitInput } from "../../schema";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map((m) => `w.${m}`);
const SPORTS = ["w.badminton", "w.table-tennis", "w.basketball", "w.volleyball"];

/** Unit 9 – Our sports day. */
const unit: UnitInput = {
  id: "u09",
  number: 9,
  title: "Our sports day",
  titleVi: "Ngày hội thể thao",
  status: "ready",
  words: ["w.sports-day", ...SPORTS, "w.running", "w.june", "w.october"],
  patterns: [
    { id: "s.when-is-sports-day", question: "When's your sports day?", answer: "It's in {month}.", meaning: "Ngày hội thể thao của bạn vào tháng nào? – Vào tháng …", slots: { month: MONTHS }, acceptAlso: ["It is in {month}.", "In {month}."] },
    { id: "s.is-sports-day-in", question: "Is your sports day in {month}?", answer: "Yes, it is.", meaning: "Ngày hội thể thao của bạn vào tháng … phải không? – Đúng. / Không.", slots: { month: MONTHS }, acceptAlso: ["No, it isn't.", "No, it is not.", "Yes.", "No."] },
    { id: "s.what-do-you-play", question: "What do you play on sports day?", answer: "I play {sport}.", meaning: "Bạn chơi môn gì trong ngày hội thể thao?", slots: { sport: SPORTS }, acceptAlso: ["I play {sport} on sports day.", "{sport}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Các môn thể thao", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "When's your sports day?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Sports day!", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɔː/", hint: "như trong sport", target: ["sport", "ball", "tall", "four"], others: ["hot", "dog", "box", "top"] },
    { sound: "/ɒ/", hint: "như trong hot", target: ["hot", "dog", "box", "top"], others: ["sport", "ball", "tall", "four"] },
  ],
  chant: {
    title: "Sports day!",
    lines: [
      { text: "When's your sports day? It's in June!", gap: "June" },
      { text: "Is it in May? No, it isn't!", gap: "No, it isn't" },
      { text: "What do you play? I play basketball!", gap: "basketball" },
      { text: "Run, jump, play. Hooray, sports day!" },
    ],
  },
  editorNote: "Danh sách môn thể thao soạn theo chủ đề; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
