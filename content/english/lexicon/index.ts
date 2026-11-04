import { Word, type WordInput } from "../../schema";
import countries from "./countries";
import animals from "./animals";
import routines from "./routines";
import week from "./week";
import party from "./party";
import abilities from "./abilities";
import school from "./school";
import sportsDay from "./sports-day";
import holidays from "./holidays";
import home from "./home";
import jobs from "./jobs";
import appearance from "./appearance";
import daily from "./daily";
import weekends from "./weekends";
import weather from "./weather";
import city from "./city";
import shopping from "./shopping";
import animalWorld from "./animal-world";
import camp from "./camp";

const sources: WordInput[][] = [countries, animals, routines, week, party, abilities, school, sportsDay, holidays, home, jobs, appearance, daily, weekends, weather, city, shopping, animalWorld, camp];
const all = sources.flat().map((w) => Word.parse(w));

const seen = new Set<string>();
for (const w of all) {
  if (seen.has(w.id)) throw new Error(`Trùng ID từ ${w.id}`);
  seen.add(w.id);
}

export const lexicon: ReadonlyMap<string, Word> = new Map(all.map((w) => [w.id, w]));

export function getWord(id: string): Word {
  const word = lexicon.get(id);
  if (!word) throw new Error(`Không tìm thấy từ ${id} trong kho từ`);
  return word;
}
