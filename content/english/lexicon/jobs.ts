import type { WordInput } from "../../schema";

/** Unit 12 (Jobs). */
const jobs: WordInput[] = [
  { id: "w.teacher", text: "teacher", meaning: "giáo viên", image: "art-teacher", level: "starters", topics: ["jobs"], example: "My mother is a teacher." },
  { id: "w.doctor", text: "doctor", meaning: "bác sĩ", image: "art-doctor", level: "starters", topics: ["jobs"], example: "The doctor works in a hospital." },
  { id: "w.nurse", text: "nurse", meaning: "y tá", image: "art-nurse", level: "movers", topics: ["jobs"], example: "She's a nurse." },
  { id: "w.farmer", text: "farmer", meaning: "nông dân", image: "art-farmer", level: "movers", topics: ["jobs"], example: "My grandpa is a farmer." },
  { id: "w.driver", text: "driver", meaning: "tài xế", image: "art-driver", level: "movers", topics: ["jobs"], example: "He's a taxi driver." },
  { id: "w.worker", text: "worker", meaning: "công nhân", image: "art-worker", level: "textbook", topics: ["jobs"], example: "He's a worker in a factory." },
  { id: "w.singer", text: "singer", meaning: "ca sĩ", image: "art-singer", level: "movers", topics: ["jobs"], example: "She's a singer." },
  { id: "w.hospital", text: "hospital", meaning: "bệnh viện", image: "art-hospital", level: "movers", topics: ["jobs", "city"], example: "He works in a hospital." },
  { id: "w.factory", text: "factory", meaning: "nhà máy", image: "art-factory", level: "textbook", topics: ["jobs"], example: "She works in a factory." },
  { id: "w.office", text: "office", meaning: "văn phòng", image: "art-office", level: "movers", topics: ["jobs"], example: "My father works in an office." },
];

export default jobs;
