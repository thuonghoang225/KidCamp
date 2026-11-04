"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { VOICE_CATALOG, type VoicePreference } from "@/subjects/english/speech/audio-key";
import { speaker } from "@/subjects/english/speech/speaker";
import { Icon } from "@/components/ui/Icon";
import { faVolumeHigh } from "@/components/icons";

const SAMPLE = "Hi! Let's talk. Answer quickly!";

/** Chọn giọng đọc cho bé; chỉ bật các giọng đã có file âm thanh. */
export function VoicePicker({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState<VoicePreference>(defaultValue as VoicePreference);
  const [ready, setReady] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/audio/manifest.json")
      .then((r) => (r.ok ? r.json() : { voices: [] }))
      .then((m: { voices: string[] }) => setReady(m.voices))
      .catch(() => setReady([]));
  }, []);

  const options: Array<{ id: VoicePreference; label: string; note: string; available: boolean }> = [
    { id: "rotate", label: "Luân phiên", note: "Heart → Bella → Michael, đổi giọng mỗi bài", available: true },
    ...VOICE_CATALOG.map((v) => ({
      id: v.id,
      label: v.label,
      note: `${v.provider === "azure" ? "Azure" : "Kokoro"} · giọng ${v.gender}`,
      available: ready === null || ready.includes(v.id),
    })),
  ];

  return (
    <fieldset className="space-y-2">
      <legend className="font-bold">Giọng đọc</legend>
      <input type="hidden" name={name} value={value} />
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <div
            key={o.id}
            className={clsx(
              "flex items-center gap-2 rounded-2xl border-2 p-2 pl-3",
              value === o.id ? "border-forest-500 bg-forest-50" : "border-forest-100",
              !o.available && "opacity-50",
            )}
          >
            <label className="flex flex-1 cursor-pointer items-center gap-2">
              <input type="radio" checked={value === o.id} disabled={!o.available} onChange={() => setValue(o.id)} className="size-5 accent-forest-600" />
              <span>
                <span className="block font-bold">{o.label}</span>
                <span className="block text-xs text-muted">{o.available ? o.note : "Chưa tạo âm thanh (xem README)"}</span>
              </span>
            </label>
            {o.available && (
              <button
                type="button"
                aria-label={`Nghe thử giọng ${o.label}`}
                onClick={() => void speaker.play(SAMPLE, { voice: o.id === "rotate" ? "heart" : o.id })}
                className="grid size-10 place-items-center rounded-full bg-sky-600 text-white"
              >
                <Icon icon={faVolumeHigh} />
              </button>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
