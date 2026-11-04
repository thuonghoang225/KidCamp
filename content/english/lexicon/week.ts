import type { WordInput } from "../../schema";

const day = (id: string, text: string, meaning: string, example: string): WordInput => ({
  id, text, meaning, example, image: "calendar", level: "textbook", topics: ["time"], pictureable: false,
});

/** Unit 3 (My week): các ngày trong tuần + hoạt động. */
const week: WordInput[] = [
  day("w.monday", "Monday", "thứ Hai", "Today is Monday."),
  day("w.tuesday", "Tuesday", "thứ Ba", "I have English on Tuesday."),
  day("w.wednesday", "Wednesday", "thứ Tư", "It's Wednesday today."),
  day("w.thursday", "Thursday", "thứ Năm", "I play football on Thursday."),
  day("w.friday", "Friday", "thứ Sáu", "Friday is a fun day."),
  day("w.saturday", "Saturday", "thứ Bảy", "I watch TV on Saturday."),
  day("w.sunday", "Sunday", "Chủ nhật", "I go swimming on Sunday."),
  { id: "w.play-football", text: "play football", meaning: "đá bóng", image: "art-play-football", level: "starters", topics: ["sports"], example: "I play football with my friends." },
  { id: "w.watch-tv", text: "watch TV", meaning: "xem ti vi", image: "art-watch-tv", level: "starters", topics: ["leisure"], example: "I watch TV in the evening." },
  { id: "w.listen-to-music", text: "listen to music", meaning: "nghe nhạc", image: "art-listen-to-music", level: "starters", topics: ["leisure"], example: "I listen to music on Sundays." },
  { id: "w.go-swimming", text: "go swimming", meaning: "đi bơi", image: "art-go-swimming", level: "starters", topics: ["sports"], example: "We go swimming on Saturdays." },
];

export default week;
