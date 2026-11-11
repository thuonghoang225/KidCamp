"""
Tạo file âm thanh cho mọi câu trong app bằng Kokoro (mô hình đọc giọng mã nguồn mở, Apache-2.0).

Cách chạy (một lần cài, sau đó chỉ cần chạy lại khi thêm Unit):
  python3 -m venv .venv-tts && . .venv-tts/bin/activate
  pip install kokoro-onnx soundfile   # không có ffmpeg thì thêm: lameenc
  # tải 2 file mô hình vào .tts-models/ (xem README)
  pnpm exec tsx scripts/list-speech.ts > .data/speech.json
  python3 scripts/generate-audio.py .data/speech.json

Chỉ tạo file còn thiếu. Nên cài ffmpeg (brew install ffmpeg): mọi file đều nén bằng ffmpeg
để chất lượng đồng nhất; lameenc chỉ là phương án dự phòng.
"""
import json, os, shutil, subprocess, sys, tempfile

VOICES = {"heart": "af_heart", "bella": "af_bella", "michael": "am_michael"}
SPEED = 1.0  # tốc độ chuẩn; chế độ "chậm" do trình phát xử lý
SOUND_SPEED = 0.65  # âm đứng riêng rất ngắn: đọc chậm cho rõ
GAP_SOUND = 0.6  # giây nghỉ giữa hai lần đọc âm


_REF_PEAK: dict = {}


def reference_peak(kokoro, voice: str) -> float:
    """Đỉnh âm lượng của một câu mẫu, dùng làm chuẩn để mọi file cùng giọng to đều nhau."""
    if voice not in _REF_PEAK:
        import numpy as np
        ref, _ = kokoro.create("Good job! Let's learn English.", voice=voice, speed=SPEED, lang="en-us")
        _REF_PEAK[voice] = float(np.abs(ref).max())
    return _REF_PEAK[voice]


def sound_clip(kokoro, voice: str, it: dict):
    """Âm – nghỉ – âm (vd. /ɪə/ … /ɪə/). Từ mẫu có nút nghe riêng trong app."""
    import numpy as np
    # Dấu nhấn ˈ để Kokoro đọc âm đầy đủ, không nuốt như âm không nhấn
    snd, rate = kokoro.create("ˈ" + it["phonemes"], voice=voice, speed=SOUND_SPEED, is_phonemes=True)
    # Âm đứng riêng ra nhỏ hơn câu thường 2–4 dB: chỉnh đỉnh âm lượng bằng câu mẫu cùng giọng
    snd = snd * (reference_peak(kokoro, voice) / max(float(np.abs(snd).max()), 1e-6))
    gap = np.zeros(int(rate * GAP_SOUND), dtype=snd.dtype)
    return np.concatenate([snd, gap, snd]), rate
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
MODELS = os.environ.get("KOKORO_MODELS", os.path.join(ROOT, ".tts-models"))


def to_mp3(samples, rate: int, mp3: str) -> None:
    """Nén MP3 48 kbps mono: dùng ffmpeg nếu có, không thì dùng lameenc (pip install lameenc)."""
    import soundfile as sf
    if shutil.which("ffmpeg"):
        with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            sf.write(wav.name, samples, rate)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav.name, "-ac", "1", "-b:a", "48k", mp3], check=True)
        return
    import lameenc
    import numpy as np
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    pcm = (np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes()
    with open(mp3, "wb") as f:
        f.write(enc.encode(pcm) + enc.flush())


def main(list_path: str) -> None:
    from kokoro_onnx import Kokoro

    items = json.load(open(list_path, encoding="utf-8"))
    kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    made = 0
    for name, voice in VOICES.items():
        os.makedirs(os.path.join(OUT, name), exist_ok=True)
        for it in items:
            mp3 = os.path.join(OUT, name, f"{it['key']}.mp3")
            if os.path.exists(mp3):
                continue
            if it.get("phonemes"):
                # Âm đứng riêng (vd. /ɪə/): đọc từ phiên âm theo mẫu "âm – nghỉ – âm"
                samples, rate = sound_clip(kokoro, voice, it)
            else:
                # Dấu "…" là chỗ bé tự nói: đọc thành một nhịp nghỉ
                text = it["text"].replace("…", ",")
                samples, rate = kokoro.create(text, voice=voice, speed=SPEED, lang="en-us")
            to_mp3(samples, rate, mp3)
            made += 1
    keys = sorted(it["key"] for it in items)
    # Giọng nào có đủ file (Kokoro ở đây, Azure do script riêng tạo) thì đưa vào manifest
    voices = []
    for name in sorted(os.listdir(OUT)):
        folder = os.path.join(OUT, name)
        if os.path.isdir(folder) and all(os.path.exists(os.path.join(folder, f"{k}.mp3")) for k in keys):
            voices.append(name)
    manifest = {"voices": voices, "keys": keys}
    json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), separators=(",", ":"))
    print(f"Xong: tạo mới {made} file, tổng {len(items)} câu × {len(VOICES)} giọng")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, ".data", "speech.json"))
