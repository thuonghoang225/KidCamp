import type { WordInput } from "../../schema";

const MONTHS: Array<[string, string]> = [
  ["January", "tháng Một"], ["February", "tháng Hai"], ["March", "tháng Ba"], ["April", "tháng Tư"],
  ["May", "tháng Năm"], ["June", "tháng Sáu"], ["July", "tháng Bảy"], ["August", "tháng Tám"],
  ["September", "tháng Chín"], ["October", "tháng Mười"], ["November", "tháng Mười Một"], ["December", "tháng Mười Hai"],
];

/** Unit 4 (My birthday party): 12 tháng + đồ ăn, đồ uống ở tiệc. */
const party: WordInput[] = [
  ...MONTHS.map(([text, meaning]): WordInput => ({
    id: `w.${text.toLowerCase()}`, text, meaning, image: "calendar", level: "textbook", topics: ["time"], pictureable: false,
    example: `My birthday is in ${text}.`,
  })),
  { id: "w.cake", text: "cake", meaning: "bánh ngọt", image: "birthday-cake", level: "starters", topics: ["food"], example: "I'd like some cake." },
  { id: "w.chips", text: "chips", meaning: "khoai tây chiên", image: "french-fries", level: "starters", topics: ["food"], example: "I'd like some chips." },
  { id: "w.pizza", text: "pizza", meaning: "bánh pizza", image: "pizza", level: "textbook", topics: ["food"], example: "Let's have some pizza." },
  { id: "w.sweets", text: "sweets", meaning: "kẹo", image: "candy", level: "starters", topics: ["food"], example: "I like sweets." },
  { id: "w.burger", text: "burger", meaning: "bánh hamburger", image: "hamburger", level: "starters", topics: ["food"], example: "I'd like a burger." },
  { id: "w.juice", text: "juice", meaning: "nước ép", image: "beverage-box", level: "starters", topics: ["food"], example: "I'd like some juice." },
  { id: "w.milk", text: "milk", meaning: "sữa", image: "glass-of-milk", level: "starters", topics: ["food"], example: "I drink milk every day." },
];

export default party;
