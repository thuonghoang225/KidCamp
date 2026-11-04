import type { UnitInput } from "../../schema";

/** Unit 19 – The animal world. Mỗi con vật một mẫu câu cố định (trạng từ đi với động từ riêng). */
const unit: UnitInput = {
  id: "u19",
  number: 19,
  title: "The animal world",
  titleVi: "Thế giới động vật",
  status: "ready",
  words: ["w.loudly", "w.quietly", "w.quickly", "w.slowly", "w.beautifully", "w.rabbit", "w.peacock", "w.cat"],
  patterns: [
    { id: "s.how-does-the-lion-roar", question: "How does the lion roar?", answer: "It roars loudly.", meaning: "Sư tử gầm thế nào? – Nó gầm rất to.", slots: {}, acceptAlso: ["It roars loudly!", "Loudly."] },
    { id: "s.how-does-the-elephant-walk", question: "How does the elephant walk?", answer: "It walks slowly.", meaning: "Voi đi thế nào? – Nó đi chậm.", slots: {}, acceptAlso: ["Slowly."] },
    { id: "s.how-does-the-rabbit-run", question: "How does the rabbit run?", answer: "It runs quickly.", meaning: "Thỏ chạy thế nào? – Nó chạy nhanh.", slots: {}, acceptAlso: ["Quickly."] },
    { id: "s.how-does-the-peacock-dance", question: "How does the peacock dance?", answer: "It dances beautifully.", meaning: "Công múa thế nào? – Nó múa đẹp.", slots: {}, acceptAlso: ["Beautifully."] },
    { id: "s.how-does-the-cat-walk", question: "How does the cat walk?", answer: "It walks quietly.", meaning: "Mèo đi thế nào? – Nó đi nhẹ nhàng.", slots: {}, acceptAlso: ["Quietly."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Con vật làm thế nào", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "How does the lion roar?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Animal parade", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/i/", hint: "âm cuối nhẹ trong slowly", target: ["slowly", "quickly", "loudly", "happy"], others: ["slow", "quick", "loud", "cat"] },
    { sound: "/ɔː/", hint: "như trong roar", target: ["roar", "walk", "tall", "small"], others: ["run", "jump", "fun", "cup"] },
  ],
  chant: {
    title: "Animal parade",
    lines: [
      { text: "The lion roars loudly, ROAR, ROAR, ROAR!", gap: "loudly" },
      { text: "The elephant walks slowly across the floor.", gap: "slowly" },
      { text: "The rabbit runs quickly, hop, hop, hop!", gap: "quickly" },
      { text: "The peacock dances beautifully. Don't stop!", gap: "beautifully" },
    ],
  },
  editorNote: "Sách dùng mẫu Subject + verb + adverb; đối chiếu cặp con vật – động từ – trạng từ với sách của bé.",
};

export default unit;
