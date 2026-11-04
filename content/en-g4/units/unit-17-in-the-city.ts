import type { UnitInput } from "../../schema";

const TRANSPORT = ["w.bus", "w.car", "w.bike", "w.motorbike", "w.train"];
const PLACES = ["w.post-office", "w.bus-stop", "w.cinema", "w.supermarket", "w.hospital", "w.park"];

/** Unit 17 – In the city. */
const unit: UnitInput = {
  id: "u17",
  number: 17,
  title: "In the city",
  titleVi: "Trong thành phố",
  status: "ready",
  words: [...TRANSPORT, "w.post-office", "w.bus-stop"],
  patterns: [
    { id: "s.how-can-i-get-to", question: "How can I get to the {place}?", answer: "You can go by {transport}.", meaning: "Mình đi đến … bằng cách nào? – Bạn có thể đi bằng …", slots: { place: PLACES, transport: TRANSPORT }, acceptAlso: ["By {transport}.", "Go by {transport}."] },
    { id: "s.how-do-you-go-to-school", question: "How do you go to school?", answer: "I go by {transport}.", meaning: "Bạn đi học bằng gì? – Mình đi bằng …", slots: { transport: TRANSPORT }, acceptAlso: ["By {transport}.", "I go to school by {transport}."] },
    { id: "s.is-the-place-near", question: "Is the {place} near here?", answer: "Yes, it is.", meaning: "… có gần đây không? – Có. / Không.", slots: { place: PLACES }, acceptAlso: ["No, it isn't.", "No, it is not.", "Yes.", "No."] },
  ],
  stations: [
    { id: "words", title: "Từ mới", subtitle: "Xe cộ và địa điểm", exercises: ["listen-pick-image", "image-pick-word", "spell-word", "say-word"] },
    { id: "patterns", title: "Mẫu câu", subtitle: "How can I get to the park?", exercises: ["pick-answer", "order-words", "say-sentence"] },
    { id: "chant", title: "Hát và chant", subtitle: "Beep beep, city", exercises: ["chant"] },
    { id: "sounds", title: "Âm", subtitle: "Luyện phát âm", exercises: ["pick-sound", "say-word"] },
    { id: "challenge", title: "Thử thách", subtitle: "10 câu tổng hợp", exercises: ["mixed-quiz"] },
  ],
  phonics: [
    { sound: "/ʌ/", hint: "như trong bus", target: ["bus", "bun", "run", "cut"], others: ["car", "park", "bike", "train"] },
    { sound: "/eɪ/", hint: "như trong train", target: ["train", "rain", "play", "say"], others: ["bus", "car", "bike", "boat"] },
  ],
  chant: {
    title: "Beep beep, city",
    lines: [
      { text: "How can I get to the park?" },
      { text: "You can go by bus, beep beep!", gap: "bus" },
      { text: "How do you go to school?" },
      { text: "I go by bike, ring ring!", gap: "bike" },
    ],
  },
  editorNote: "Sách có thể dùng thêm giới từ chỉ vị trí (next to, opposite…); đối chiếu và bổ sung mẫu câu nếu cần.",
};

export default unit;
