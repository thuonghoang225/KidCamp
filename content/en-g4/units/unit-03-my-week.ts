import type { UnitInput } from "../../schema";

const DAYS = ["w.monday", "w.tuesday", "w.wednesday", "w.thursday", "w.friday", "w.saturday", "w.sunday"];
const ACTIVITIES = ["w.play-football", "w.watch-tv", "w.listen-to-music", "w.go-swimming"];

/** Unit 3 – My week. */
const unit: UnitInput = {
  id: "u03",
  number: 3,
  title: "My week",
  titleVi: "Tuần của em",
  status: "ready",
  words: [...DAYS, ...ACTIVITIES],
  patterns: [
    { id: "s.what-day-is-it", question: "What day is it today?", answer: "It's {day}.", meaning: "Hôm nay là thứ mấy? – Hôm nay là …", slots: { day: DAYS }, acceptAlso: ["It is {day}.", "Today is {day}.", "{day}."] },
    { id: "s.what-do-you-do-on-sundays", question: "What do you do on Sundays?", answer: "I {activity} on Sundays.", meaning: "Bạn làm gì vào Chủ nhật?", slots: { activity: ACTIVITIES }, acceptAlso: ["I {activity}."] },
    { id: "s.what-do-you-do-on-saturdays", question: "What do you do on Saturdays?", answer: "I {activity} on Saturdays.", meaning: "Bạn làm gì vào thứ Bảy?", slots: { activity: ACTIVITIES }, acceptAlso: ["I {activity}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Các ngày trong tuần", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What day is it today?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Seven days in a week", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/eɪ/", hint: "như trong day", target: ["day", "play", "today", "say"], others: ["eat", "see", "tree", "week"] },
    { sound: "/iː/", hint: "như trong week", target: ["week", "see", "tree", "eat"], others: ["day", "play", "say", "May"] },
  ],
  chant: {
    title: "Seven days in a week",
    lines: [
      { text: "Monday, Tuesday, Wednesday too," },
      { text: "Thursday, Friday, me and you!", gap: "Friday" },
      { text: "Saturday, Sunday, time to play," },
      { text: "Seven days, hooray, hooray!", gap: "Seven days" },
      { text: "What do you do on Sundays?" },
      { text: "I play football on Sundays!", gap: "play football" },
    ],
  },
  editorNote: "Danh sách hoạt động soạn theo chủ đề; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
