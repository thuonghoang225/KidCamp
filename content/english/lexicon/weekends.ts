import type { WordInput } from "../../schema";

/** Unit 15 (My family's weekends). */
const weekends: WordInput[] = [
  { id: "w.cinema", text: "cinema", meaning: "rạp chiếu phim", image: "art-cinema", level: "movers", topics: ["city"], example: "We go to the cinema on Saturdays." },
  { id: "w.supermarket", text: "supermarket", meaning: "siêu thị", image: "art-supermarket", level: "movers", topics: ["city"], example: "Mum goes to the supermarket." },
  { id: "w.swimming-pool", text: "swimming pool", meaning: "bể bơi", image: "art-swimming-pool", level: "movers", topics: ["city", "sports"], example: "I swim in the swimming pool." },
  { id: "w.bookshop", text: "bookshop", meaning: "hiệu sách", image: "art-bookshop", level: "movers", topics: ["city"], example: "He buys books at the bookshop." },
  { id: "w.sports-centre", text: "sports centre", meaning: "trung tâm thể thao", image: "art-sports-centre", level: "movers", topics: ["city", "sports"], example: "They play badminton at the sports centre." },
];

export default weekends;
