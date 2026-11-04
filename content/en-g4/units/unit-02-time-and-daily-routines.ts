import type { UnitInput } from "../../schema";

const TIMES = ["w.six-oclock", "w.seven-oclock", "w.eight-oclock", "w.nine-oclock", "w.ten-oclock"];

/** Unit 2 – Time and daily routines. Mẫu câu theo chương trình; chant và câu ví dụ do KidCamp tự viết. */
const unit: UnitInput = {
  id: "u02",
  number: 2,
  title: "Time and daily routines",
  titleVi: "Thời gian và việc hằng ngày",
  status: "ready",
  words: ["w.get-up", "w.have-breakfast", "w.go-to-school", "w.have-lunch", "w.do-homework", "w.have-dinner", "w.go-to-bed", ...TIMES],
  patterns: [
    { id: "s.what-time-is-it", question: "What time is it?", answer: "It's {time}.", meaning: "Mấy giờ rồi? – … giờ.", slots: { time: TIMES }, acceptAlso: ["It is {time}.", "{time}."] },
    { id: "s.what-time-get-up", question: "What time do you get up?", answer: "I get up at {time}.", meaning: "Bạn thức dậy lúc mấy giờ?", slots: { time: ["w.six-oclock", "w.seven-oclock"] }, acceptAlso: ["At {time}."] },
    { id: "s.what-time-go-to-school", question: "What time do you go to school?", answer: "I go to school at {time}.", meaning: "Bạn đi học lúc mấy giờ?", slots: { time: ["w.six-oclock", "w.seven-oclock"] }, acceptAlso: ["At {time}."] },
    { id: "s.what-time-go-to-bed", question: "What time do you go to bed?", answer: "I go to bed at {time}.", meaning: "Bạn đi ngủ lúc mấy giờ?", slots: { time: ["w.nine-oclock", "w.ten-oclock"] }, acceptAlso: ["At {time}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Giờ và việc hằng ngày", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "What time is it?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Tick tock, what time is it?", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/aɪ/", hint: "như trong time", target: ["time", "nine", "five", "night"], others: ["ten", "get", "bed", "milk"] },
    { sound: "/uː/", hint: "như trong school", target: ["school", "two", "noon", "food"], others: ["book", "look", "good", "foot"] },
  ],
  chant: {
    title: "Tick tock, what time is it?",
    lines: [
      { text: "Tick tock, tick tock, what time is it?" },
      { text: "It's six o'clock. Get up, get up!", gap: "Get up" },
      { text: "Tick tock, tick tock, what time is it?" },
      { text: "It's seven o'clock. Go to school!", gap: "Go to school" },
      { text: "Tick tock, tick tock, what time is it?" },
      { text: "It's nine o'clock. Go to bed!", gap: "Go to bed" },
    ],
  },
  editorNote: "Danh sách từ soạn theo chủ đề và mẫu câu của Unit 2; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
