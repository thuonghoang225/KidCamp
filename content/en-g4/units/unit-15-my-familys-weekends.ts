import type { UnitInput } from "../../schema";

const PLACES = ["w.cinema", "w.supermarket", "w.swimming-pool", "w.bookshop", "w.sports-centre", "w.park", "w.zoo"];

/** Unit 15 – My family's weekends. */
const unit: UnitInput = {
  id: "u15",
  number: 15,
  title: "My family's weekends",
  titleVi: "Cuối tuần của gia đình em",
  status: "ready",
  words: PLACES,
  patterns: [
    { id: "s.where-do-you-go-on-weekends", question: "Where do you go on weekends?", answer: "I go to the {place}.", meaning: "Cuối tuần bạn đi đâu? – Mình đi …", slots: { place: PLACES }, acceptAlso: ["To the {place}.", "I go to the {place} on weekends."] },
    { id: "s.where-does-she-go", question: "Where does she go on weekends?", answer: "She goes to the {place}.", meaning: "Cuối tuần bạn ấy (nữ) đi đâu? – Bạn ấy đi …", slots: { place: PLACES }, acceptAlso: ["To the {place}."] },
    { id: "s.do-you-go-to-the", question: "Do you go to the {place} on Sundays?", answer: "Yes, I do.", meaning: "Chủ nhật bạn có đi … không? – Có. / Không.", slots: { place: PLACES }, acceptAlso: ["No, I don't.", "No, I do not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Những nơi gia đình đi", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "Where do you go on weekends?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Weekend fun", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ɪ/", hint: "như trong cinema", target: ["cinema", "swim", "film", "pink"], others: ["see", "tea", "beach", "green"] },
    { sound: "/ɑː/", hint: "như trong park", target: ["park", "car", "market", "father"], others: ["cat", "map", "hat", "bag"] },
  ],
  chant: {
    title: "Weekend fun",
    lines: [
      { text: "Where do you go on weekends?" },
      { text: "I go to the cinema, cinema, yay!", gap: "cinema" },
      { text: "Where does she go on weekends?" },
      { text: "She goes to the park to play all day!", gap: "park" },
    ],
  },
  editorNote: "Đối chiếu danh sách địa điểm và mẫu câu ngôi thứ ba với sách của bé.",
};

export default unit;
