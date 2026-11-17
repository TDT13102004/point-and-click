# Bản chơi thử — Những bóng người trên tầng 13

Game point-and-click chạy trên trình duyệt, không cần cài đặt hay build. Dùng bộ asset `assets/demo-v1/`.

## Chạy thử trên máy

```bash
python3 -m http.server 4173
```

Rồi mở http://localhost:4173/game/ (chạy lệnh ở thư mục gốc repo).

## Nội dung

Chiếu nghỉ tầng 12 → nghe băng EVP → lên hành lang tầng 13 → vào căn 1305 → tìm tua vít → tháo ô kỹ thuật → lấy sách đỏ → đọc mảnh giấy → bóng người ở cửa phòng ngủ → hết bản thử.

## Sửa ở đâu

- `game.js`, phần `SCENES`: cảnh, điểm bấm (toạ độ chuẩn hoá `[x, y, rộng, cao]` theo ảnh), lời thoại.
- `DOCS` trong `game.js`: văn bản tài liệu (lấy từ `assets/demo-v1/documents/demo-documents.json`).
- Đường dẫn ảnh/âm thanh đọc từ `assets/demo-v1/manifest.json`. Thêm bản `-v2` vào manifest thì game tự dùng. Nếu đổi góc máy, phải chỉnh lại toạ độ điểm bấm.
- Tiến trình lưu trong trình duyệt (localStorage). Nút "Chơi lại" xoá tiến trình.

## Triển khai

Vercel phục vụ thư mục gốc dưới dạng web tĩnh. `/` chuyển tới `/game/`. `.vercelignore` chỉ đưa `game/` và `assets/` lên; tài liệu truyện, `source-web/` và file tham khảo không được public.
