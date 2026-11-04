import type { WordInput } from "../../schema";

/** Unit 6 (Our school facilities), Unit 7–8 (môn học). */
const school: WordInput[] = [
  // Cơ sở vật chất
  { id: "w.playground", text: "playground", meaning: "sân chơi", image: "art-playground", level: "starters", topics: ["school"], example: "We play in the playground." },
  { id: "w.library", text: "library", meaning: "thư viện", image: "art-library", level: "movers", topics: ["school"], example: "There is a library at my school." },
  { id: "w.computer-room", text: "computer room", meaning: "phòng máy tính", image: "art-computer-room", level: "textbook", topics: ["school"], example: "The computer room is big." },
  { id: "w.music-room", text: "music room", meaning: "phòng âm nhạc", image: "art-music-room", level: "textbook", topics: ["school"], example: "We sing in the music room." },
  { id: "w.art-room", text: "art room", meaning: "phòng mỹ thuật", image: "art-art-room", level: "textbook", topics: ["school"], example: "We draw in the art room." },
  { id: "w.gym", text: "gym", meaning: "phòng thể chất", image: "art-gym", level: "textbook", topics: ["school", "sports"], example: "We play games in the gym." },
  { id: "w.garden", text: "garden", meaning: "vườn trường", image: "art-garden", level: "starters", topics: ["school", "home"], example: "There are flowers in the garden." },
  // Số lượng (thẻ số tự vẽ)
  { id: "w.ten", text: "ten", meaning: "mười", image: "num-10", level: "starters", topics: ["numbers"] },
  { id: "w.twelve", text: "twelve", meaning: "mười hai", image: "num-12", level: "starters", topics: ["numbers"] },
  { id: "w.fifteen", text: "fifteen", meaning: "mười lăm", image: "num-15", level: "starters", topics: ["numbers"] },
  { id: "w.twenty", text: "twenty", meaning: "hai mươi", image: "num-20", level: "starters", topics: ["numbers"] },
  // Môn học
  { id: "w.maths", text: "Maths", meaning: "môn Toán", image: "art-maths", level: "textbook", topics: ["school"], example: "I have Maths today." },
  { id: "w.english", text: "English", meaning: "môn Tiếng Anh", image: "art-english", level: "textbook", topics: ["school"], example: "I like English." },
  { id: "w.vietnamese", text: "Vietnamese", meaning: "môn Tiếng Việt", image: "art-vietnamese", level: "textbook", topics: ["school"], example: "We have Vietnamese every day." },
  { id: "w.science", text: "Science", meaning: "môn Khoa học", image: "art-science", level: "textbook", topics: ["school"], example: "Science is interesting." },
  { id: "w.art", text: "Art", meaning: "môn Mỹ thuật", image: "art-art", level: "textbook", topics: ["school"], example: "I have Art on Friday." },
  { id: "w.music", text: "Music", meaning: "môn Âm nhạc", image: "art-music", level: "textbook", topics: ["school"], example: "Music is fun." },
  { id: "w.pe", text: "PE", meaning: "môn Thể dục", image: "art-pe", level: "textbook", topics: ["school", "sports"], example: "We have PE in the gym." },
  { id: "w.it", text: "IT", meaning: "môn Tin học", image: "art-it", level: "textbook", topics: ["school"], example: "I have IT on Wednesday." },
  // Lý do (khó vẽ)
  { id: "w.fun", text: "fun", meaning: "vui", image: "art-fun", level: "starters", topics: ["school"] },
  { id: "w.interesting", text: "interesting", meaning: "thú vị", image: "art-interesting", level: "movers", topics: ["school"] },
  { id: "w.easy", text: "easy", meaning: "dễ", image: "art-easy", level: "movers", topics: ["school"] },
];

export default school;
