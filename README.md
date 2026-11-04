# KidCamp

Trại học của bé: **Tiếng Anh lớp 4 (Global Success)** kèm luyện nói phản xạ mỗi ngày. Kiến trúc sẵn cho nhiều môn (Toán sẽ thêm sau).

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres + Auth + Storage) · Font Awesome · Web Speech API.

## Chạy thử ngay (chế độ Demo, không cần Supabase)

```bash
pnpm install
pnpm dev
```

Mở http://localhost:3000 → tạo hồ sơ bé → học. Dữ liệu lưu trong `.data/` trên máy. Góc phụ huynh: lần đầu bấm 🔒 sẽ đặt mã PIN 4 số.

> Nghe giọng nói của bé hoạt động tốt nhất trên **Chrome / Edge** (laptop). Trên **iPad (Safari)** cần bật Siri & Đọc chính tả trong Cài đặt; nếu máy không nghe được, web tự chuyển sang nút "Con đã nói".

## Chạy với Supabase (dữ liệu thật, bố mẹ xem trên điện thoại)

1. Tạo project tại https://supabase.com (gói miễn phí).
2. Mở **SQL Editor**, chạy toàn bộ file `supabase/migrations/20261103000000_init.sql`
   (hoặc dùng Supabase CLI: `supabase link` rồi `supabase db push`).
3. **Authentication → URL Configuration**: thêm `http://localhost:3000/auth/callback` và URL thật khi deploy (ví dụ `https://kidcamp.vercel.app/auth/callback`).
   Muốn đăng nhập Google: bật provider Google trong Authentication → Providers.
4. Tạo `.env.local` từ `.env.example`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   PARENT_COOKIE_SECRET=$(openssl rand -hex 32)
   ```
5. `pnpm dev` → Tạo tài khoản (email + mật khẩu) → tạo hồ sơ bé. Trong Supabase tắt **Confirm email** (Authentication → Sign In / Providers → Email) để đăng ký xong vào được ngay.

Deploy: đẩy repo lên GitHub → import vào Vercel → khai báo 3 biến môi trường như trên.

## Giọng đọc

App phát file MP3 tạo sẵn. Phụ huynh chọn giọng cho từng bé trong **Góc phụ huynh → Hồ sơ bé → Giọng đọc**
(có nút nghe thử): một giọng cố định, hoặc **Luân phiên** (heart → bella → michael, mỗi bài đổi một giọng).
Trên màn học, bé bấm **Bình thường / Chậm** để nghe chậm lại (0,75×, giữ nguyên cao độ giọng); lựa chọn nhớ theo thiết bị.
Câu chưa có file thì app tự dùng giọng của trình duyệt.

### Kokoro (mặc định, mã nguồn mở Apache-2.0)

Thêm hoặc sửa nội dung → tạo lại âm thanh (chỉ tạo file còn thiếu):

```bash
python3 -m venv .venv-tts && . .venv-tts/bin/activate
pip install kokoro-onnx soundfile          # cần thêm ffmpeg: brew install ffmpeg
mkdir -p .tts-models && cd .tts-models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd .. && pnpm audio:list && python3 scripts/generate-audio.py
```

### Azure (tùy chọn)

Giọng Neural của Microsoft: `ana` (giọng bé gái), `jenny`, `aria` (nữ), `guy` (nam).

1. Vào [portal.azure.com](https://portal.azure.com) → **Create a resource** → tìm **Speech** → tạo, chọn
   Pricing tier **Free F0** (miễn phí 0,5 triệu ký tự mỗi tháng; toàn bộ câu của app chỉ khoảng 20 nghìn ký tự mỗi giọng).
2. Mở tài nguyên vừa tạo → **Keys and Endpoint** → chép **KEY 1** và **Location/Region**.
3. Thêm vào `.env.local`:
   ```
   AZURE_SPEECH_KEY=<KEY 1>
   AZURE_SPEECH_REGION=southeastasia
   ```
4. Tạo âm thanh (chỉ tạo file còn thiếu; gói F0 giới hạn lượt mỗi phút nên chạy khoảng 30–45 phút mỗi giọng):
   ```bash
   pnpm audio:list
   pnpm audio:azure ana            # hoặc: pnpm audio:azure ana jenny guy
   ```
5. Vào Hồ sơ bé, giọng Azure sẽ hiện để chọn. Key chỉ dùng trên máy khi tạo file, không gửi lên trình duyệt.

## Hình minh họa

- Từ chỉ hành động, môn học, phòng học, tính từ, nghề, nơi chốn… dùng **tranh KidCamp tự vẽ** (SVG, `scripts/art/`),
  cùng một nhân vật bé để dễ nhận ra hành động. Sửa tranh trong `scripts/art/*.ts` rồi chạy `pnpm assets:sync`.
- Đồ ăn, con vật dùng Fluent Emoji (MIT); cờ dùng flag-icons (MIT).

## Lệnh

| Lệnh | Việc |
| --- | --- |
| `pnpm dev` | Chạy local |
| `pnpm build` / `pnpm start` | Build và chạy bản production |
| `pnpm test` | Unit test (Vitest): ôn ngắt quãng, chấm bài, chấm nói, streak, nội dung |
| `pnpm typecheck` / `pnpm lint` | Kiểm tra kiểu và lint |
| `pnpm content:check` | Kiểm tra nội dung bài học (ID từ, hình, mẫu câu) |
| `pnpm assets:sync` | Tải / chép hình minh họa vào `public/img` |
| `pnpm audio:list` | Liệt kê mọi câu cần đọc vào `.data/speech.json` |

## Cấu trúc

```text
content/                 Nội dung là code (kiểm tra bằng Zod)
  schema.ts              Kiểu chung: Course, Unit, Word, Pattern, Dialogue
  courses.ts             Danh sách môn + khóa đang bật
  english/lexicon/       Kho từ tiếng Anh dùng chung (sách + chủ đề)
  en-g4/units/           Unit 1 → 20 (Unit 1 đã soạn)
  en-g4/dialogues/       Kịch bản đóng vai
  characters/            Trang phục nhân vật của bé
  assets.ts              Hình minh họa + nguồn + giấy phép
src/
  core/                  Dùng chung mọi môn, hàm thuần có test
    srs/                 Ôn ngắt quãng Leitner 5 hộp (1-2-4-7-14 ngày)
    exercises/           Sinh bài tập từ nội dung + chấm bài
    grading/             Chuẩn hóa câu, chấm câu nói
    session/             Chọn bài cho buổi học, bài ôn đến hạn
    rewards/             Sao, streak (nghỉ 1 ngày/tuần không mất chuỗi)
  subjects/english/      Phần riêng tiếng Anh: đọc / nghe giọng nói
  server/
    actions/             Server actions: học, nói chuyện, hồ sơ, phụ huynh
    repo/                Truy cập dữ liệu: supabase.ts (thật) và demo.ts (file JSON)
    auth/                Phiên phụ huynh, hồ sơ bé, cookie mở khóa có chữ ký
  components/            Giao diện: bài tập, nói chuyện, nhân vật, phụ huynh
  app/                   Trang (App Router)
    (kid)/               Khu của bé: trang chủ, khóa học, Unit, luyện nói
    (play)/              Màn làm bài toàn màn hình
    parent/              Góc phụ huynh (mã PIN)
supabase/migrations/     Schema + Row Level Security
tests/unit/              Vitest
```

## Đã có trong bản này

- Unit 1–5 đã soạn (từ vựng, mẫu câu, chant tự viết, âm, hội thoại đóng vai), kèm âm thanh 3 giọng.
- Hồ sơ bé, chọn và đổi hồ sơ (nút "Đổi bạn"), Góc phụ huynh có mã PIN (khóa sau 10 phút, giới hạn nhập sai).
- Màn chọn môn (Tiếng Anh; Toán "sắp mở"), bản đồ 20 Unit, Unit 1 đầy đủ 5 trạm:
  Từ mới · Mẫu câu · Hát và chant · Âm · Thử thách.
- 9 dạng bài: nghe chọn hình, nhìn hình chọn từ, xếp chữ, nói từ, chọn câu trả lời, xếp câu, nói câu, chant karaoke, chọn âm.
- Câu sai được hỏi lại cuối buổi; ôn ngắt quãng; "Ôn hôm nay" lấy tối đa 8 item đến hạn.
- Luyện phản xạ: Hỏi nhanh (8 câu trộn) và Đóng vai 3 lượt, gợi ý giảm dần, đo thời gian phản xạ.
- Nhân vật có khuôn mặt bé: chụp / chọn ảnh, cắt ngay trên máy, chỉ lưu khuôn mặt đã cắt.
- Trang phụ huynh: phút học 7 ngày, streak, số câu tự nói, thời gian phản xạ, tỉ lệ không cần gợi ý, từ hay sai, câu hỏi gợi ý cho bữa cơm.

## Việc tiếp theo

- Đối chiếu nội dung Unit 1–5 với sách của bé (`content/en-g4/units/`), soạn Unit 6–20 và 4 bài Review.
- Học từ theo chủ đề (kho từ đã có cấu trúc, ví dụ `english/lexicon/animals.ts`).
- Gọi cho bạn AI (route `/api/conversation`), PWA cài như app, giọng đọc thu sẵn.
- Sinh kiểu TypeScript từ schema: `supabase gen types typescript --linked > src/lib/supabase/database.types.ts`.
