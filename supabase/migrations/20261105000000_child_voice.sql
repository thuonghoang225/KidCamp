-- Giọng đọc phụ huynh chọn cho bé: 'rotate' (luân phiên giọng Kokoro) hoặc ID giọng trong VOICE_CATALOG.
alter table public.children add column if not exists voice text not null default 'rotate';
