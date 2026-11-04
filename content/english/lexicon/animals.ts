import type { WordInput as Word } from "../../schema";

/**
 * Chủ đề Animals (Cambridge YLE). Dùng cho tính năng học từ theo chủ đề
 * (giai đoạn 2); khai báo sẵn để kiểm tra cấu trúc kho từ.
 */
const animals: Word[] = [
  { id: "w.lion", text: "lion", meaning: "sư tử", image: "lion", level: "starters", topics: ["animals"], example: "The lion is big." },
  { id: "w.zebra", text: "zebra", meaning: "ngựa vằn", image: "zebra", level: "starters", topics: ["animals"], example: "I like zebras." },
  { id: "w.monkey", text: "monkey", meaning: "con khỉ", image: "monkey", level: "starters", topics: ["animals"], example: "The monkey can climb." },
  { id: "w.elephant", text: "elephant", meaning: "con voi", image: "elephant", level: "starters", topics: ["animals"], example: "There is an elephant." },
  { id: "w.giraffe", text: "giraffe", meaning: "hươu cao cổ", image: "giraffe", level: "starters", topics: ["animals"], example: "The giraffe is tall." },
  { id: "w.tiger", text: "tiger", meaning: "con hổ", image: "tiger", level: "starters", topics: ["animals"], example: "I can see a tiger." },
  { id: "w.crocodile", text: "crocodile", meaning: "cá sấu", image: "crocodile", level: "starters", topics: ["animals"], example: "The crocodile can swim." },
  { id: "w.bear", text: "bear", meaning: "con gấu", image: "bear", level: "movers", topics: ["animals"], example: "The bear is brown." },
];

export default animals;
