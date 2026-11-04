import { describe, expect, it } from "vitest";
import { scoreSpeech } from "@/core/grading/speech";
import { normalize } from "@/core/grading/text";

describe("normalize", () => {
  it("mở rút gọn và bỏ dấu câu", () => {
    expect(normalize("I'm from Vietnam!")).toBe("i am from viet nam");
    expect(normalize("She’s from Japan.")).toBe("she is from japan");
  });
});

describe("chấm giờ và rút gọn", () => {
  it("nhận diện trả về số vẫn khớp chữ", () => {
    expect(scoreSpeech("it's 7:00", ["It's seven o'clock."]).passed).toBe(true);
    expect(scoreSpeech("I get up at 6 o'clock", ["I get up at six o'clock."]).passed).toBe(true);
  });
  it("I'd và can't", () => {
    expect(scoreSpeech("I would like some juice", ["I'd like some juice."]).passed).toBe(true);
    expect(scoreSpeech("no I cannot", ["No, I can't."]).passed).toBe(true);
  });
});

describe("scoreSpeech", () => {
  it("câu đúng hoàn toàn đạt 100%", () => {
    const s = scoreSpeech("i am from viet nam", ["I'm from Viet Nam."]);
    expect(s.score).toBe(1);
    expect(s.passed).toBe(true);
  });
  it("cho phép sai 1 ký tự với từ dài", () => {
    expect(scoreSpeech("I'm from Australya", ["I'm from Australia."]).passed).toBe(true);
  });
  it("thiếu từ thì đánh dấu từ chưa khớp", () => {
    const s = scoreSpeech("from Japan", ["She's from Japan."]);
    expect(s.passed).toBe(false);
    expect(s.words.filter((w) => !w.matched).map((w) => w.word)).toEqual(["she", "is"]);
  });
  it("lấy câu được chấp nhận khớp nhất", () => {
    const s = scoreSpeech("from Britain", ["He's from Britain.", "From Britain."]);
    expect(s.score).toBe(1);
  });
});
