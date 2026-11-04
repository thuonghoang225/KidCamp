# KidCamp — Hướng dẫn thương hiệu

Nguồn sự thật cho màu là `src/app/globals.css` (`@theme`). Tài liệu này giải thích cách dùng.

## Ý tưởng

Trại hè trong rừng thông: xanh rừng, nắng vàng, bầu trời, lửa trại. Vui, ấm, khích lệ; nút bấm kiểu "kẹo" lún xuống khi nhấn.

## Logo

- Biểu tượng: lều trại kem dưới mặt trời vàng, nền xanh rừng bo góc. File: `src/app/icon.svg`; component `LogoMark` trong `src/components/ui/Logo.tsx`.
- Logo đầy đủ: `<Logo />` = biểu tượng + chữ **Kid** (forest-700) **Camp** (ember-600), Nunito Black.
- Icon iOS (`src/app/apple-icon.tsx`) không bo góc vì iOS tự bo. Không đổi màu, không kéo giãn, không đặt logo lên nền ảnh rối.

## Màu

| Họ | Vai trò |
|---|---|
| forest | Màu chính: nút chính, tiến độ, thành công |
| sun | Sao, phần thưởng, điểm nhấn; luôn đi với chữ `ink` |
| sky | Nghe, giọng đọc, thông tin phụ |
| ember | Luyện nói, chuỗi ngày, lỗi (nhẹ nhàng) |
| cream / ink / muted | Nền trang / chữ chính / chữ phụ |

**Quy tắc tương phản (WCAG AA):**

- Chữ trắng trên nền màu đặc → `-600` trở lên (`forest-600` 4.8:1, `sky-600` 4.6:1, `ember-600` 5.0:1).
- Chữ màu trên nền nhạt `-50/-100`, trắng hoặc cream → `-700` (`sun-700` cho chữ trên `sun-100`).
- `-500` chỉ cho đồ họa: thanh tiến độ, biểu đồ, viền, icon lớn.
- Thang `sky` mặc định của Tailwind đã bị xóa (`--color-sky-*: initial`); chỉ dùng sắc độ có trong `globals.css`.
- Màu cần dùng ngoài CSS (metadata, manifest, icon) lấy từ `src/lib/brand.ts`.

## Màu minh họa

Tranh tự vẽ sinh từ `scripts/art/` (bảng màu `C` trong `kit.ts`). Màu áo, quần, mặt trời, trời, xanh dương dùng đúng hex thương hiệu. Da, tóc, gỗ, đỏ, đêm, nước, cỏ là màu riêng cho tranh, không dùng cho giao diện. Sau khi thêm tranh: `pnpm assets:sync` rồi `node scripts/snap-art-colors.mjs public/img/kidcamp` (phải báo `snapped 0`).

## Chữ

Nunito Variable.

| Độ đậm | Dùng cho |
|---|---|
| `font-black` | Tiêu đề, số liệu, logo |
| `font-extrabold` | Nút bấm và nội dung tiếng Anh trong bài tập |
| `font-bold` | Nhấn mạnh trong đoạn, thông báo |

Không dùng `semibold`, `medium`, `light`.

## Giọng văn

- Nói với bé: xưng **con**, gọi bé là **con**/**bé**. Câu ngắn, có dấu chấm than vừa phải.
- Khi sai: khích lệ, không phán xét ("Chưa đúng, mình học lại nhé!"). Không dùng "Sai".
- Khu dành cho người lớn tên là **Góc phụ huynh**. Trong câu nói trực tiếp với người lớn dùng **bố mẹ** ("Email của bố mẹ").
- Tên sản phẩm luôn viết **KidCamp** (liền, K và C viết hoa).
