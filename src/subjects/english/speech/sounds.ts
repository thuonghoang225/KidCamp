/**
 * Đọc riêng một âm (vd. /ɪə/). Giọng đọc không đọc được ký hiệu IPA từ chữ, nên file âm thanh của âm
 * được tạo từ phiên âm (Kokoro: bộ ký hiệu misaki; Azure: SSML <phoneme alphabet="ipa">).
 * File đọc "âm – nghỉ – âm" (vd. /ɪə/ … /ɪə/), chậm, để bé nghe rõ; từ mẫu có nút nghe riêng.
 * App phát file theo khóa audioKey(soundText(sound)), giống mọi câu khác.
 */
export const soundText = (sound: string) => `sound:${sound}`;

/** IPA trong sách (Anh–Anh) → ký hiệu phát âm của Kokoro (misaki, giọng Mỹ). */
export const KOKORO_PHONEMES: Record<string, string> = {
  "/ʌ/": "ʌ",
  "/ɔː/": "ɔː",
  "/iː/": "iː",
  "/i/": "i",
  "/ɪ/": "ɪ",
  "/aɪ/": "I",
  "/uː/": "uː",
  "/ʊ/": "ʊ",
  "/juː/": "juː",
  "/ʃ/": "ʃ",
  "/ɜː/": "ɜː",
  "/eɪ/": "A",
  "/ɒ/": "ɒ",
  "/ɑː/": "ɑː",
  "/aʊ/": "W",
  "/æ/": "æ",
  "/θ/": "θ",
  "/tʃ/": "ʧ",
  "/dʒ/": "ʤ",
  "/ŋ/": "ŋ",
  "/ɪə/": "ɪə",
  "/əʊ/": "O",
  "/ə/": "ə",
};

/** IPA để gửi Azure (bỏ dấu gạch chéo). */
export const ipaOf = (sound: string) => sound.replace(/^\/|\/$/g, "");
