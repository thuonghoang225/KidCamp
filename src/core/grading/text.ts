/** Chuẩn hóa câu tiếng Anh để so sánh: chữ thường, bỏ dấu câu, mở rút gọn. */
const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'm\b/g, "i am"],
  [/\bshe's\b/g, "she is"],
  [/\bhe's\b/g, "he is"],
  [/\bit's\b/g, "it is"],
  [/\bthey're\b/g, "they are"],
  [/\bwe're\b/g, "we are"],
  [/\byou're\b/g, "you are"],
  [/\bwhat's\b/g, "what is"],
  [/\bwhere's\b/g, "where is"],
  [/\bname's\b/g, "name is"],
  [/\bvietnam\b/g, "viet nam"],
  [/\bi'd\b/g, "i would"],
  [/\bcan't\b/g, "cannot"],
  [/\bcan not\b/g, "cannot"],
  [/\bwhen's\b/g, "when is"],
  [/\bo'clock\b/g, "oclock"],
  [/\bo clock\b/g, "oclock"],
];

const NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** Nhận diện giọng nói hay trả về số ("7:00", "7"): đổi thành chữ để so với câu mẫu. */
function spellNumbers(s: string): string {
  return s
    .replace(/\b(\d{1,2}):00\b/g, (_, h: string) => `${NUMBERS[Number(h)] ?? h} oclock`)
    .replace(/\b(\d{1,2})\b/g, (_, n: string) => NUMBERS[Number(n)] ?? n);
}

export function normalize(text: string): string {
  let s = spellNumbers(text.toLowerCase().replace(/[’‘`]/g, "'"));
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  return s
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function words(text: string): string[] {
  const n = normalize(text);
  return n ? n.split(" ") : [];
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

export function sameText(a: string, b: string): boolean {
  return normalize(a).replace(/ /g, "") === normalize(b).replace(/ /g, "");
}
