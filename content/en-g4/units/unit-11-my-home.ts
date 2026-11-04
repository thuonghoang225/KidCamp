import type { UnitInput } from "../../schema";

const HOMES = ["w.house", "w.flat"];
const STREET = ["w.busy", "w.quiet", "w.noisy", "w.beautiful"];

/** Unit 11 – My home. Mẫu câu theo chương trình; chant, hội thoại do KidCamp tự viết. */
const unit: UnitInput = {
  id: "u11",
  number: 11,
  title: "My home",
  titleVi: "Nhà của em",
  status: "ready",
  words: [...HOMES, "w.street", "w.village", ...STREET],
  patterns: [
    { id: "s.where-do-you-live", question: "Where do you live?", answer: "I live in a {home}.", meaning: "Bạn sống ở đâu? – Mình sống ở …", slots: { home: HOMES }, acceptAlso: ["In a {home}."] },
    { id: "s.whats-the-street-like", question: "What's the street like?", answer: "It's {adj}.", meaning: "Con phố trông thế nào? – Nó …", slots: { adj: STREET }, acceptAlso: ["It is {adj}.", "{adj}."] },
    { id: "s.do-you-live-in-a", question: "Do you live in a {home}?", answer: "Yes, I do.", meaning: "Bạn có sống ở … không? – Có. / Không.", slots: { home: HOMES }, acceptAlso: ["No, I don't.", "No, I do not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Nhà và đường phố", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Where do you live?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "My street", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/aʊ/", hint: "như trong house", target: ["house", "town", "mouse", "brown"], others: ["home", "phone", "road", "nose"] },
    { sound: "/iː/", hint: "như trong street", target: ["street", "green", "tree", "sleep"], others: ["big", "village", "pink", "sit"] },
  ],
  chant: {
    title: "My street",
    lines: [
      { text: "Where do you live? Where do you live?" },
      { text: "I live in a flat, a big tall flat!", gap: "flat" },
      { text: "What's the street like? What's the street like?" },
      { text: "It's busy, busy, beep beep beep!", gap: "busy" },
    ],
  },
  editorNote: "Đối chiếu từ (house, flat, street, village…) và tính từ mô tả đường phố với sách của bé.",
};

export default unit;
