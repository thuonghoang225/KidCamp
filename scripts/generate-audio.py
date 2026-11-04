"""
Tạo file âm thanh cho mọi câu trong app bằng Kokoro (mô hình đọc giọng mã nguồn mở, Apache-2.0).

Cách chạy (một lần cài, sau đó chỉ cần chạy lại khi thêm Unit):
  python3 -m venv .venv-tts && . .venv-tts/bin/activate
  pip install kokoro-onnx soundfile
  # tải 2 file mô hình vào .tts-models/ (xem README)
  pnpm exec tsx scripts/list-speech.ts > .data/speech.json
  python3 scripts/generate-audio.py .data/speech.json

Chỉ tạo file còn thiếu; cần ffmpeg để nén MP3.
"""
import json, os, subprocess, sys, tempfile

VOICES = {"heart": "af_heart", "bella": "af_bella", "michael": "am_michael"}
SPEED = 1.0  # tốc độ chuẩn; chế độ "chậm" do trình phát xử lý
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
MODELS = os.environ.get("KOKORO_MODELS", os.path.join(ROOT, ".tts-models"))


def main(list_path: str) -> None:
    from kokoro_onnx import Kokoro
    import soundfile as sf

    items = json.load(open(list_path, encoding="utf-8"))
    kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    made = 0
    for name, voice in VOICES.items():
        os.makedirs(os.path.join(OUT, name), exist_ok=True)
        for it in items:
            mp3 = os.path.join(OUT, name, f"{it['key']}.mp3")
            if os.path.exists(mp3):
                continue
            # Dấu "…" là chỗ bé tự nói: đọc thành một nhịp nghỉ
            text = it["text"].replace("…", ",")
            samples, rate = kokoro.create(text, voice=voice, speed=SPEED, lang="en-us")
            with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
                sf.write(wav.name, samples, rate)
                subprocess.run(
                    ["ffmpeg", "-loglevel", "error", "-y", "-i", wav.name, "-ac", "1", "-b:a", "48k", mp3],
                    check=True,
                )
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
