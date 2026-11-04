import type { UnitInput } from "../../schema";

const PLACES = ["w.playground", "w.library", "w.computer-room", "w.music-room", "w.art-room", "w.gym", "w.garden"];
const NUMBERS = ["w.ten", "w.twelve", "w.fifteen", "w.twenty"];

/** Unit 6 – Our school facilities. Mẫu câu theo chương trình; chant, hội thoại do KidCamp tự viết. */
const unit: UnitInput = {
  id: "u06",
  number: 6,
  title: "Our school facilities",
  titleVi: "Cơ sở vật chất trường em",
  status: "ready",
  words: [...PLACES, ...NUMBERS],
  patterns: [
    { id: "s.is-there-a", question: "Is there a {place} at your school?", answer: "Yes, there is.", meaning: "Trường bạn có … không? – Có. / Không.", slots: { place: PLACES }, acceptAlso: ["No, there isn't.", "No, there is not.", "Yes.", "No."] },
    { id: "s.how-many-classrooms", question: "How many classrooms are there?", answer: "There are {number} classrooms.", meaning: "Có bao nhiêu phòng học? – Có … phòng học.", slots: { number: NUMBERS }, acceptAlso: ["{number} classrooms.", "{number}."] },
    { id: "s.how-many-computers", question: "How many computers are there?", answer: "There are {number} computers.", meaning: "Có bao nhiêu máy tính? – Có … máy tính.", slots: { number: NUMBERS }, acceptAlso: ["{number} computers.", "{number}."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Phòng học và sân trường", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Is there a library?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "My school is great", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɪ/", hint: "như trong gym", target: ["gym", "big", "sit", "pink"], others: ["green", "tree", "read", "sea"] },
    { sound: "/ʊ/", hint: "như trong book", target: ["book", "look", "good", "cook"], others: ["school", "room", "food", "pool"] },
  ],
  chant: {
    title: "My school is great",
    lines: [
      { text: "Is there a library? Yes, there is!", gap: "Yes, there is" },
      { text: "Is there a playground? Yes, there is!", gap: "Yes, there is" },
      { text: "How many classrooms are there?" },
      { text: "There are twenty classrooms. My school is great!", gap: "twenty" },
    ],
  },
  editorNote: "Danh sách phòng học soạn theo chủ đề; đối chiếu với sách và sửa nếu khác.",
};

export default unit;
