import type { Asset } from "./schema";

/**
 * Mỗi hình khai báo một lần, kèm nguồn và giấy phép.
 * `pnpm assets:sync` chép / tải đúng các file này vào public/img.
 */

export type AssetOrigin =
  | { kind: "fluent"; folder: string; skinTone: boolean }
  | { kind: "flag"; code: string }
  | { kind: "kidcamp" };

type AssetDef = Asset & { origin: AssetOrigin };

const fluent = (key: string, folder: string, skinTone = false): AssetDef => ({
  key,
  file: `/img/emoji/${key}.png`,
  source: "fluent-emoji",
  license: `MIT · microsoft/fluentui-emoji · assets/${folder}`,
  origin: { kind: "fluent", folder, skinTone },
});
const flag = (code: string): AssetDef => ({
  key: `flag-${code}`,
  file: `/img/flags/${code}.svg`,
  source: "flag-icons",
  license: "MIT · lipis/flag-icons",
  origin: { kind: "flag", code },
});
/** Hình KidCamp tự vẽ (scripts/sync-assets.ts sinh ra), ví dụ mặt đồng hồ. */
const own = (key: string): AssetDef => ({
  key,
  file: `/img/kidcamp/${key}.svg`,
  source: "kidcamp",
  license: "KidCamp",
  origin: { kind: "kidcamp" },
});

/** Hình minh họa KidCamp tự vẽ (scripts/art), trùng tên với ID từ: w.swim → art-swim. */
export const ART_NAMES = [
  "get-up", "have-breakfast", "go-to-school", "have-lunch", "do-homework", "have-dinner", "go-to-bed", "swim",
  "ride-a-bike", "play-the-guitar", "draw", "dance", "sing", "skate", "cook", "play-chess",
  "play-football", "watch-tv", "listen-to-music", "go-swimming", "running", "wash-the-dishes", "clean-the-floor", "read-books",
  "play-games", "maths", "english", "vietnamese", "science", "art", "music", "pe",
  "it", "playground", "library", "computer-room", "music-room", "art-room", "gym", "garden",
  "busy", "quiet", "noisy", "beautiful", "tall", "short", "slim", "big",
  "young", "old", "fun", "interesting", "easy", "brother", "sister", "house",
  "flat", "street", "village", "teacher", "doctor", "nurse", "farmer", "driver",
  "worker", "singer", "hospital", "factory", "office", "morning", "afternoon", "evening",
  "cinema", "supermarket", "swimming-pool", "bookshop", "sports-centre", "badminton", "table-tennis", "basketball",
  "volleyball", "sports-day",
] as const;

export const assetDefs: AssetDef[] = [
  ...ART_NAMES.map((n) => own(`art-${n}`)),
  ...["vn", "us", "au", "gb", "jp", "my", "sg", "th"].map(flag),
  // Con vật
  fluent("lion", "Lion"),
  fluent("zebra", "Zebra"),
  fluent("monkey", "Monkey"),
  fluent("elephant", "Elephant"),
  fluent("giraffe", "Giraffe"),
  fluent("tiger", "Tiger"),
  fluent("crocodile", "Crocodile"),
  fluent("bear", "Bear"),
  // Phần thưởng, trang trí
  fluent("star", "Star"),
  fluent("glowing-star", "Glowing star"),
  fluent("fire", "Fire"),
  fluent("trophy", "Trophy"),
  fluent("party-popper", "Party popper"),
  fluent("camping", "Camping"),
  // Unit 2: giờ và việc hằng ngày
  fluent("alarm-clock", "Alarm clock"),
  fluent("bowl-with-spoon", "Bowl with spoon"),
  fluent("school", "School"),
  fluent("bento-box", "Bento box"),
  fluent("pencil", "Pencil"),
  fluent("pot-of-food", "Pot of food"),
  fluent("bed", "Bed"),
  ...[6, 7, 8, 9, 10].map((h) => own(`clock-${h}`)),
  // Unit 3: tuần của em
  fluent("calendar", "Spiral calendar"),
  fluent("soccer-ball", "Soccer ball"),
  fluent("television", "Television"),
  fluent("headphone", "Headphone"),
  fluent("person-swimming", "Person swimming", true),
  // Unit 4: tiệc sinh nhật
  fluent("birthday-cake", "Birthday cake"),
  fluent("french-fries", "French fries"),
  fluent("beverage-box", "Beverage box"),
  fluent("glass-of-milk", "Glass of milk"),
  fluent("candy", "Candy"),
  fluent("pizza", "Pizza"),
  fluent("hamburger", "Hamburger"),
  // Unit 5: những việc em làm được
  fluent("person-biking", "Person biking", true),
  fluent("guitar", "Guitar"),
  fluent("artist-palette", "Artist palette"),
  fluent("woman-dancing", "Woman dancing", true),
  fluent("microphone", "Microphone"),
  fluent("ice-skate", "Ice skate"),
  fluent("cooking", "Cooking"),
  fluent("chess-pawn", "Chess pawn"),
  // Unit 6: cơ sở vật chất trường
  fluent("playground-slide", "Playground slide"),
  fluent("books", "Books"),
  fluent("desktop-computer", "Desktop computer"),
  fluent("musical-notes", "Musical notes"),
  fluent("person-lifting-weights", "Person lifting weights", true),
  fluent("potted-plant", "Potted plant"),
  ...[10, 12, 15, 20].map((n) => own(`num-${n}`)),
  // Unit 7–8: môn học
  fluent("abacus", "Abacus"),
  fluent("open-book", "Open book"),
  fluent("notebook", "Notebook"),
  fluent("test-tube", "Test tube"),
  fluent("musical-note", "Musical note"),
  fluent("basketball", "Basketball"),
  fluent("laptop", "Laptop"),
  fluent("grinning-face", "Grinning face"),
  fluent("light-bulb", "Light bulb"),
  fluent("thumbs-up", "Thumbs up", true),
  // Unit 9: ngày hội thể thao
  fluent("badminton", "Badminton"),
  fluent("ping-pong", "Ping pong"),
  fluent("volleyball", "Volleyball"),
  fluent("person-running", "Person running", true),
  fluent("sports-medal", "Sports medal"),
  // Unit 10: kỳ nghỉ hè
  fluent("beach-with-umbrella", "Beach with umbrella"),
  fluent("classical-building", "Classical building"),
  fluent("national-park", "National park"),
  fluent("ferris-wheel", "Ferris wheel"),
  // Unit 11: nhà của em
  fluent("house", "House"),
  fluent("office-building", "Office building"),
  fluent("motorway", "Motorway"),
  fluent("hut", "Hut"),
  fluent("automobile", "Automobile"),
  fluent("shushing-face", "Shushing face"),
  fluent("loudspeaker", "Loudspeaker"),
  fluent("sparkles", "Sparkles"),
  // Unit 12: nghề nghiệp
  fluent("teacher", "Teacher", true),
  fluent("man-health-worker", "Man health worker", true),
  fluent("woman-health-worker", "Woman health worker", true),
  fluent("farmer", "Farmer", true),
  fluent("taxi", "Taxi"),
  fluent("factory-worker", "Factory worker", true),
  fluent("singer", "Singer", true),
  fluent("hospital", "Hospital"),
  fluent("factory", "Factory"),
  fluent("briefcase", "Briefcase"),
  // Unit 13: ngoại hình
  fluent("baby", "Baby", true),
  fluent("person-standing", "Person standing", true),
  fluent("child", "Child", true),
  fluent("old-man", "Old man", true),
  fluent("boy", "Boy", true),
  fluent("girl", "Girl", true),
  // Unit 14: hoạt động hằng ngày
  fluent("sunrise", "Sunrise"),
  fluent("sun", "Sun"),
  fluent("night-with-stars", "Night with stars"),
  fluent("sponge", "Sponge"),
  fluent("broom", "Broom"),
  fluent("video-game", "Video game"),
  // Unit 15: cuối tuần
  fluent("cinema", "Cinema"),
  fluent("shopping-cart", "Shopping cart"),
  fluent("stadium", "Stadium"),
];

export const assets: Asset[] = assetDefs.map((a) => ({ key: a.key, file: a.file, source: a.source, license: a.license }));

export const assetMap: ReadonlyMap<string, Asset> = new Map(assets.map((a) => [a.key, a]));

export function assetUrl(key: string): string {
  return assetMap.get(key)?.file ?? "/img/emoji/star.png";
}
