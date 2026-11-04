/** Trang phục nhân vật của bé. `headSlot` là ô đặt ảnh khuôn mặt (toạ độ trong viewBox 200×260). */
export type Costume = {
  id: string;
  name: string;
  starsToUnlock: number;
  shirt: string;
  pants: string;
  accent: string;
  hat: "ranger" | "cap" | "none";
};

export const HEAD_SLOT = { cx: 100, cy: 74, r: 48 } as const;

export const costumes: Costume[] = [
  { id: "camper", name: "Nhà thám hiểm trại hè", starsToUnlock: 0, shirt: "#2f9e5b", pants: "#8a5a2b", accent: "#ffc933", hat: "ranger" },
  { id: "sporty", name: "Cầu thủ nhí", starsToUnlock: 15, shirt: "#2b8fe0", pants: "#1f2a24", accent: "#ffffff", hat: "cap" },
  { id: "sunny", name: "Bạn nắng mai", starsToUnlock: 30, shirt: "#f06a3a", pants: "#2b8fe0", accent: "#ffdb66", hat: "none" },
];

export function getCostume(id: string): Costume {
  return costumes.find((c) => c.id === id) ?? costumes[0];
}
