import type { UnitInput } from "../../schema";

const SUBJECTS = ["w.maths", "w.english", "w.vietnamese", "w.science", "w.art", "w.music", "w.pe", "w.it"];
const SCHOOL_DAYS = ["w.monday", "w.tuesday", "w.wednesday", "w.thursday", "w.friday"];

/** Unit 7 – Our timetables. */
const unit: UnitInput = {
  id: "u07",
  number: 7,
  title: "Our timetables",
  titleVi: "Thời khóa biểu",
  status: "ready",
  words: SUBJECTS,
  patterns: [
    { id: "s.when-do-you-have", question: "When do you have {subject}?", answer: "I have it on {day}.", meaning: "Bạn học môn … vào hôm nào? – Mình học vào …", slots: { subject: SUBJECTS, day: SCHOOL_DAYS }, acceptAlso: ["I have {subject} on {day}.", "On {day}."] },
    { id: "s.what-subjects-today", question: "What subjects do you have today?", answer: "I have {subject} today.", meaning: "Hôm nay bạn có môn gì? – Hôm nay mình có môn …", slots: { subject: SUBJECTS }, acceptAlso: ["I have {subject}.", "{subject}."] },
    { id: "s.what-do-you-have-on", question: "What do you have on Mondays?", answer: "I have {subject}.", meaning: "Thứ Hai bạn có môn gì?", slots: { subject: SUBJECTS }, acceptAlso: ["I have {subject} on Mondays.", "{subject}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Các môn học", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "When do you have English?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "My timetable", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ʌ/", hint: "như trong Monday", target: ["Monday", "fun", "sun", "run"], others: ["home", "go", "no", "phone"] },
    { sound: "/θ/", hint: "như trong Maths", target: ["Maths", "Thursday", "three", "think"], others: ["sing", "sun", "six", "seven"] },
  ],
  chant: {
    title: "My timetable",
    lines: [
      { text: "When do you have English? I have it on Monday!", gap: "Monday" },
      { text: "When do you have Maths? I have it on Tuesday!", gap: "Tuesday" },
      { text: "When do you have Music? I have it on Friday!", gap: "Friday" },
      { text: "Every day, every day, we learn and play!" },
    ],
  },
  editorNote: "Danh sách môn học soạn theo chương trình lớp 4; đối chiếu với thời khóa biểu thật của bé.",
};

export default unit;
