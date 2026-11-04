import { addDays, type Day } from "../date";

/** Khoảng cách ôn (ngày) cho hộp 1→5. */
export const INTERVALS = [1, 2, 4, 7, 14] as const;
export const MAX_BOX = INTERVALS.length;

export type ItemState = {
  box: number; // 0 = chưa học, 1..5
  dueOn: Day | null;
  correctCount: number;
  wrongCount: number;
};

export const NEW_ITEM: ItemState = { box: 0, dueOn: null, correctCount: 0, wrongCount: 0 };

/**
 * Hệ thống Leitner 5 hộp: đúng thì lên một hộp, sai thì về hộp 1.
 * Hàm thuần — dễ test và dễ thay bằng thuật toán khác (ví dụ FSRS).
 */
export function review(prev: ItemState, correct: boolean, today: Day): ItemState {
  const box = correct ? Math.min(prev.box + 1, MAX_BOX) : 1;
  return {
    box,
    dueOn: addDays(today, INTERVALS[box - 1]),
    correctCount: prev.correctCount + (correct ? 1 : 0),
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
  };
}

export function isDue(state: Pick<ItemState, "dueOn">, today: Day): boolean {
  return state.dueOn !== null && state.dueOn <= today;
}
