import { fillSlots, type Pattern, type StationId, type Unit, type Word } from "@content/schema";
import { getWord } from "@content/english/lexicon";
import { assetUrl } from "@content/assets";
import { pick, sample, shuffle, type Rng } from "../random";
import { normalize } from "../grading/text";
import type { Choice, Exercise, PickAnswer, OrderWords, SaySentence } from "./types";

let counter = 0;
const key = (kind: string, id: string) => `${kind}:${id}:${(counter++).toString(36)}`;

/** Từ khó vẽ (thứ, tháng…) hiện chữ thay cho hình. */
const pictureOf = (w: Word): string | undefined => (w.pictureable ? assetUrl(w.image) : undefined);
const wordChoice = (w: Word): Choice => ({ id: w.id, label: w.text, image: pictureOf(w), audio: w.text });

/** Ưu tiên từ cùng loại (có hình / chỉ chữ) để các phương án trông đồng đều, không lộ đáp án. */
function distractors(target: Word, pool: Word[], n: number, rng: Rng): Word[] {
  const rest = pool.filter((w) => w.id !== target.id);
  const same = rest.filter((w) => w.pictureable === target.pictureable);
  if (same.length >= n) return sample(same, n, rng);
  return [...same, ...sample(rest.filter((w) => w.pictureable !== target.pictureable), n - same.length, rng)];
}

/* ---------------- Từ vựng ---------------- */

export function listenPickImage(word: Word, pool: Word[], rng: Rng): Exercise {
  const options = shuffle([word, ...distractors(word, pool, 3, rng)], rng).map(wordChoice);
  return { key: key("lpi", word.id), kind: "listen-pick-image", itemId: word.id, audio: word.text, options, answerId: word.id };
}

export function imagePickWord(word: Word, pool: Word[], rng: Rng): Exercise {
  if (!word.pictureable) return listenPickImage(word, pool, rng);
  const options = shuffle([word, ...distractors(word, pool, 3, rng)], rng).map((w) => ({ id: w.id, label: w.text, audio: w.text }));
  return { key: key("ipw", word.id), kind: "image-pick-word", itemId: word.id, image: assetUrl(word.image), options, answerId: word.id };
}

/** Chỉ cho xếp chữ với từ ngắn (≤ 9 chữ cái), cụm dài xếp sẽ quá khó với bé lớp 4. */
export const canSpell = (w: Word) => w.text.replace(/[^A-Za-z]/g, "").length <= 9;

export function spellWord(word: Word, rng: Rng): Exercise {
  const letters = word.text.replace(/\s+/g, "").split("");
  return {
    key: key("spl", word.id),
    kind: "spell-word",
    itemId: word.id,
    image: assetUrl(word.image),
    hint: word.pictureable ? undefined : word.meaning,
    audio: word.text,
    answer: word.text,
    tiles: shuffle(letters, rng),
  };
}

export function sayWord(word: Word): Exercise {
  return {
    key: key("sw", word.id),
    kind: "say-word",
    itemId: word.id,
    text: word.text,
    image: pictureOf(word),
    meaning: word.meaning,
    accept: [word.text],
  };
}

/* ---------------- Mẫu câu ---------------- */

/**
 * Chọn một giá trị cho mỗi slot của mẫu câu.
 * `image` có khi giá trị đó vẽ được (cờ, đồng hồ, đồ ăn…): bé nhìn hình để biết cần nói gì.
 */
export function chooseSlots(
  pattern: Pattern,
  rng: Rng,
): { values: Record<string, string>; image?: string; imageSlot?: string } {
  const values: Record<string, string> = {};
  let image: string | undefined;
  let imageSlot: string | undefined;
  for (const [slot, ids] of Object.entries(pattern.slots)) {
    const w = getWord(pick(ids, rng));
    values[slot] = w.text;
    // Slot đã nằm trong câu hỏi thì không cần hình gợi ý
    if (!image && !pattern.question.includes(`{${slot}}`) && w.pictureable) {
      image = pictureOf(w);
      imageSlot = slot;
    }
  }
  return { values, image, imageSlot };
}

/** Câu hỏi đã điền slot (vd. "Can you {action}?" → "Can you swim?"). */
export const questionOf = (pattern: Pattern, values: Record<string, string>) => fillSlots(pattern.question, values);

/**
 * Những slot bé biết phải nói giá trị nào: slot có trong câu hỏi, hoặc slot có hình gợi ý.
 * Slot còn lại (vd. "I have it on {day}" – bé tự chọn ngày) chấp nhận mọi giá trị.
 */
export function determinedValues(pattern: Pattern, values: Record<string, string>, imageSlot?: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const slot of Object.keys(pattern.slots)) {
    if (pattern.question.includes(`{${slot}}`) || slot === imageSlot) out[slot] = values[slot];
  }
  return out;
}

/** Mọi câu trả lời hợp lệ: slot cố định giữ nguyên, slot tự do lấy mọi giá trị (tích Đề-các). */
export function acceptedAnswers(pattern: Pattern, fixed: Record<string, string> = {}): string[] {
  let filled = [pattern.answer, ...pattern.acceptAlso].map((t) => fillSlots(t, fixed));
  for (const [slot, ids] of Object.entries(pattern.slots)) {
    if (slot in fixed) continue;
    const texts = ids.map((id) => getWord(id).text);
    filled = filled.flatMap((t) => (t.includes(`{${slot}}`) ? texts.map((v) => fillSlots(t, { [slot]: v })) : [t]));
  }
  return [...new Set(filled)];
}

/** Câu nhiễu dự phòng khi các mẫu câu trong Unit quá giống nhau. */
export const FALLBACK_DISTRACTORS = ["I'm from Viet Nam.", "It's seven o'clock.", "Yes, I can.", "She can sing.", "There are ten classrooms.", "I'd like some juice.", "It's in June."];

export function pickAnswer(pattern: Pattern, others: Pattern[], rng: Rng): PickAnswer {
  const { values, image } = chooseSlots(pattern, rng);
  const correct = fillSlots(pattern.answer, values);
  // Phương án nhiễu phải rõ ràng là sai: bỏ các câu cùng mở đầu (vd. "I have…" với "I have…"),
  // vì những câu đó có thể cũng là câu trả lời hợp lý.
  const opening = (t: string) => normalize(t).split(" ").slice(0, 2).join(" ");
  const candidates = [
    ...shuffle(others.filter((p) => p.id !== pattern.id), rng).map((p) => fillSlots(p.answer, chooseSlots(p, rng).values)),
    ...shuffle(FALLBACK_DISTRACTORS, rng),
  ].filter((t) => opening(t) !== opening(correct));
  const wrong = [...new Set(candidates)].slice(0, 2);
  const options = shuffle(
    [{ id: "correct", label: correct, audio: correct }, ...wrong.map((label, i) => ({ id: `wrong-${i}`, label, audio: label }))],
    rng,
  );
  return { key: key("pa", pattern.id), kind: "pick-answer", itemId: pattern.id, question: questionOf(pattern, values), image, options, answerId: "correct" };
}

export function orderWords(pattern: Pattern, rng: Rng): OrderWords {
  const { values, image } = chooseSlots(pattern, rng);
  const answer = fillSlots(pattern.answer, values);
  const tiles = shuffle(answer.replace(/[.?!]/g, "").split(" "), rng);
  return { key: key("ow", pattern.id), kind: "order-words", itemId: pattern.id, question: questionOf(pattern, values), image, answer, tiles };
}

export function saySentence(pattern: Pattern, rng: Rng): SaySentence {
  const { values, image, imageSlot } = chooseSlots(pattern, rng);
  return {
    key: key("ss", pattern.id),
    kind: "say-sentence",
    itemId: pattern.id,
    question: questionOf(pattern, values),
    image,
    model: fillSlots(pattern.answer, values),
    accept: acceptedAnswers(pattern, determinedValues(pattern, values, imageSlot)),
  };
}

/* ---------------- Trạm của Unit ---------------- */

function phonicsExercises(unit: Unit, rng: Rng): Exercise[] {
  const out: Exercise[] = [];
  for (const set of unit.phonics) {
    for (const target of sample(set.target, 3, rng)) {
      const options: Choice[] = shuffle(
        [{ id: target, label: target, audio: target }, ...sample(set.others, 2, rng).map((w) => ({ id: w, label: w, audio: w }))],
        rng,
      );
      out.push({ key: key("ps", target), kind: "pick-sound", itemId: null, sound: set.sound, hint: set.hint, options, answerId: target });
    }
    for (const w of sample(set.target, 2, rng)) {
      out.push({ key: key("sw", w), kind: "say-word", itemId: null, text: w, accept: [w] });
    }
  }
  return shuffle(out, rng);
}

/** Sinh danh sách bài tập cho một trạm của Unit. */
export function buildStation(unit: Unit, stationId: StationId, rng: Rng): Exercise[] {
  const words = unit.words.map(getWord);
  const patterns = unit.patterns;

  switch (stationId) {
    case "words": {
      const out: Exercise[] = [];
      for (const w of shuffle(words, rng)) out.push(listenPickImage(w, words, rng));
      for (const w of sample(words, 4, rng)) out.push(imagePickWord(w, words, rng));
      for (const w of sample(words.filter(canSpell), 3, rng)) out.push(spellWord(w, rng));
      for (const w of sample(words, 3, rng)) out.push(sayWord(w));
      return out;
    }
    case "patterns": {
      const out: Exercise[] = [];
      for (const p of shuffle(patterns, rng)) out.push(pickAnswer(p, patterns, rng));
      for (const p of sample(patterns, 4, rng)) out.push(orderWords(p, rng));
      for (const p of sample(patterns, 4, rng)) out.push(saySentence(p, rng));
      return out;
    }
    case "chant":
      return unit.chant
        ? [{ key: key("ch", unit.id), kind: "chant", itemId: null, title: unit.chant.title, lines: unit.chant.lines }]
        : [];
    case "sounds":
      return phonicsExercises(unit, rng);
    case "challenge": {
      const pool: Exercise[] = [
        ...words.map((w) =>
          pick([listenPickImage(w, words, rng), imagePickWord(w, words, rng), ...(canSpell(w) ? [spellWord(w, rng)] : [])], rng),
        ),
        ...patterns.map((p) => pick<Exercise>([pickAnswer(p, patterns, rng), orderWords(p, rng)], rng)),
      ];
      return sample(pool, 10, rng);
    }
  }
}

/** Sinh một bài ôn cho item đến hạn (từ `w.*` hoặc mẫu câu `s.*`). */
export function reviewExercise(itemId: string, unit: Unit, rng: Rng): Exercise | null {
  if (itemId.startsWith("w.")) {
    const pool = unit.words.map(getWord);
    const w = getWord(itemId);
    return pick([listenPickImage(w, pool, rng), imagePickWord(w, pool, rng), sayWord(w)], rng);
  }
  const pattern = unit.patterns.find((p) => p.id === itemId);
  if (!pattern) return null;
  return pick<Exercise>([pickAnswer(pattern, unit.patterns, rng), orderWords(pattern, rng), saySentence(pattern, rng)], rng);
}
