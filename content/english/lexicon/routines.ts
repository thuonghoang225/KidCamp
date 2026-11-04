import type { WordInput } from "../../schema";

/** Unit 2 (Time and daily routines) + chủ đề Time. */
const routines: WordInput[] = [
  { id: "w.get-up", text: "get up", meaning: "thức dậy", image: "art-get-up", level: "textbook", topics: ["time"], example: "I get up at six o'clock." },
  { id: "w.have-breakfast", text: "have breakfast", meaning: "ăn sáng", image: "art-have-breakfast", level: "textbook", topics: ["time", "food"], example: "I have breakfast at seven o'clock." },
  { id: "w.go-to-school", text: "go to school", meaning: "đi học", image: "art-go-to-school", level: "textbook", topics: ["time", "school"], example: "I go to school at seven o'clock." },
  { id: "w.have-lunch", text: "have lunch", meaning: "ăn trưa", image: "art-have-lunch", level: "textbook", topics: ["time", "food"], example: "We have lunch at school." },
  { id: "w.do-homework", text: "do homework", meaning: "làm bài tập về nhà", image: "art-do-homework", level: "textbook", topics: ["time", "school"], example: "I do homework after dinner." },
  { id: "w.have-dinner", text: "have dinner", meaning: "ăn tối", image: "art-have-dinner", level: "textbook", topics: ["time", "food"], example: "My family has dinner at seven o'clock." },
  { id: "w.go-to-bed", text: "go to bed", meaning: "đi ngủ", image: "art-go-to-bed", level: "textbook", topics: ["time"], example: "I go to bed at nine o'clock." },
  { id: "w.six-oclock", text: "six o'clock", meaning: "6 giờ", image: "clock-6", level: "textbook", topics: ["time"], example: "It's six o'clock." },
  { id: "w.seven-oclock", text: "seven o'clock", meaning: "7 giờ", image: "clock-7", level: "textbook", topics: ["time"], example: "It's seven o'clock." },
  { id: "w.eight-oclock", text: "eight o'clock", meaning: "8 giờ", image: "clock-8", level: "textbook", topics: ["time"], example: "It's eight o'clock." },
  { id: "w.nine-oclock", text: "nine o'clock", meaning: "9 giờ", image: "clock-9", level: "textbook", topics: ["time"], example: "It's nine o'clock." },
  { id: "w.ten-oclock", text: "ten o'clock", meaning: "10 giờ", image: "clock-10", level: "textbook", topics: ["time"], example: "It's ten o'clock." },
];

export default routines;
