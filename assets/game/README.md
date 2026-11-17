# Assets toàn game — cấu trúc thư mục và quy ước

Thư mục này là nơi đặt asset cho bản game đầy đủ (từ sân khu tập thể đến kết thúc nghi thức). Bộ demo cũ vẫn ở `assets/demo-v1/` và không bị thay đổi. Danh sách đầy đủ các asset cần làm nằm trong `asset-list.csv` (137 mục).

## Cây thư mục

```
assets/game/
├── README.md            ← file này
├── asset-list.csv       ← danh sách asset: ai làm, trạng thái, hạn
├── backgrounds/         ← ảnh nền cảnh (BG-*)
├── closeups/            ← cận cảnh khi bấm vào vật (CL-*)
├── props/               ← vật phẩm nền trong suốt (PROP-*)
├── characters/          ← chân dung nhân vật, bóng người (CHAR-*, SPR-*)
├── documents/           ← ảnh hồ sơ, nền giấy, giấy tờ (PHOTO-*, DOC-*)
├── overlays/            ← lớp phủ: bóng, viền tối, camera, trạng thái cảnh (OV-*)
├── animations/          ← sprite sheet / WebM alpha (ANIM-*)
├── maps/                ← sơ đồ (MAP-*)
├── ui/                  ← logo, con trỏ, khung, thanh vật phẩm (UI-*)
├── icons/               ← biểu tượng SVG (ICON-*)
├── audio/
│   ├── music/           ← nhạc (MUS-*)
│   ├── ambience/        ← âm nền lặp (AMB-*)
│   ├── sfx/             ← hiệu ứng âm thanh (SFX-*)
│   └── voice/           ← giọng nói, EVP (VOICE-*, VO-*)
├── source/              ← file gốc: PSD, Figma export, project âm thanh
└── prompts/             ← prompt AI đã dùng (nếu có), mỗi asset một mục
```

## Đặt tên file

- Tên file = mã ID viết thường + `-v<số>` + đuôi. Ví dụ `BG-GARAGE-BAY` → `backgrounds/bg-garage-bay-v1.png`.
- Sửa lại thì tạo `-v2`, không ghi đè `-v1`. Giữ nguyên mã ID.
- Asset có nhiều biến thể thêm số thứ tự trước phiên bản: `sfx-footsteps-01-v1.wav`.
- Không dùng dấu tiếng Việt, khoảng trắng hoặc chữ hoa trong tên file.

## Thông số chung

| Loại | Thông số |
| --- | --- |
| Ảnh nền, cận cảnh | PNG 1920×1080 (16:9), sRGB, không chữ. Cận cảnh cùng ánh sáng với cảnh gốc |
| Đạo cụ | PNG 1024×1024 nền trong suốt |
| Nhân vật | PNG 1024×1536 nền trong suốt, 3 biểu cảm |
| Biểu tượng | SVG 96×96, nét đơn 2px, một màu |
| Lớp phủ | PNG/WebP alpha hoặc SVG cùng kích thước cảnh, không nhấp nháy mạnh |
| Hoạt ảnh | Sprite sheet PNG alpha 12 fps hoặc WebM alpha, tối đa 4 giây |
| Nhạc, âm nền | WAV 48 kHz 24-bit stereo, loop liền mạch |
| SFX, giọng | WAV 48 kHz 24-bit mono, đỉnh ≤ -3 dBFS; giọng kèm file chép lời `.txt` |

## Lưu ý quan trọng

- **Chữ và manh mối dựng bằng code.** Biển số, nhãn đĩa than, graffiti, thư tay, mảnh giấy, biển căn hộ: vẽ phần nền/vật thể, để trống vùng chữ. Câu đố còn có thể đổi lời khi Việt hoá.
- **Giữ góc máy.** Lớp phủ và trạng thái (đèn tắt, cửa đóng, lúc làm lễ) phải trùng góc máy với ảnh nền gốc. Nếu đổi góc máy, báo để cập nhật điểm bấm trong `integration.json`.
- **Nhân vật hư cấu.** Không dùng ảnh người thật cho ảnh hồ sơ. Không dùng ảnh báo/Pinterest ghép trực tiếp.
- **Ghi nguồn.** Mỗi asset ghi rõ nguồn (tự vẽ, AI + prompt, thư viện có giấy phép, bản thu) vào cột Ghi chú hoặc `prompts/`.
- **Ưu tiên:** P0 = đã có trong demo (thay bản tốt hơn khi kịp), P1 = cần để chơi hết câu chuyện, P2 = làm đẹp thêm.

## Còn thiếu trong repo

- Thư mục `viet-hoa-viet-nam/hinh-giu-nguyen/` (vết khắc, graffiti, dụng cụ, chữ viết tự động) được tài liệu nhắc tới nhưng chưa được tải lên.
- Chưa có tài liệu chương 04 và 14 (phiên EVP thứ hai), nên lời thoại `VO-EVP-2` chưa chốt.
