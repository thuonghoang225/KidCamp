import { scoreSpeech } from "../grading/speech";
import { normalize, sameText } from "../grading/text";
import type { Exercise, Grade, Response } from "./types";

/**
 * Chấm một câu trả lời. Dùng chung cho client (phản hồi ngay) và server (chấm lại trước khi lưu).
 */
export function grade(ex: Exercise, res: Response): Grade {
  switch (ex.kind) {
    case "listen-pick-image":
    case "image-pick-word":
    case "pick-answer":
    case "pick-sound": {
      const expected = ex.options.find((o) => o.id === ex.answerId)?.label ?? "";
      const correct = res.type === "choice" && res.choiceId === ex.answerId;
      return { correct, score: correct ? 1 : 0, expected };
    }
    case "spell-word": {
      const correct = res.type === "text" && sameText(res.text, ex.answer);
      return { correct, score: correct ? 1 : 0, expected: ex.answer };
    }
    case "order-words": {
      const correct = res.type === "text" && normalize(res.text) === normalize(ex.answer);
      return { correct, score: correct ? 1 : 0, expected: ex.answer };
    }
    case "say-word":
    case "say-sentence": {
      const expected = ex.kind === "say-word" ? ex.text : ex.model;
      if (res.type !== "speech") return { correct: false, score: 0, expected };
      // Thiết bị không nhận diện được giọng nói: bé tự nói theo mẫu, tính là hoàn thành
      if (res.selfReported) return { correct: true, score: 1, expected };
      const s = scoreSpeech(res.transcript, ex.accept);
      return { correct: s.passed, score: s.score, expected };
    }
    case "chant":
      return { correct: res.type === "done", score: 1, expected: ex.title };
  }
}
