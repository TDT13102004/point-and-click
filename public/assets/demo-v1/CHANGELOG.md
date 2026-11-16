# Lịch sử bộ assets

## v1 — 16/11/2026

- Tạo 7 PNG bằng công cụ image_gen tích hợp: 3 cảnh, 3 trạng thái cận ô kỹ thuật, 1 sách đỏ alpha.
- Tạo 1 sơ đồ tầng SVG hư cấu, 3 lớp phủ kinh dị/camera và 5 biểu tượng SVG.
- Tạo 6 WAV hiệu ứng tổng hợp và 1 WAV giọng EVP tạm (giọng hệ thống macOS Linh + xử lý bằng mã). Lưu bản giọng khô trong source để có thể xử lý lại.
- Thêm một JSON nội dung kết nối cho demo; không ghi đè 16 tài liệu truyện gốc.
- Lưu prompt nguyên văn, ID, đường dẫn, hash, thông số file và nguồn tham chiếu.
- Tạo preview.html, contact-sheet.png, integration.json và hướng dẫn thay/tạo lại.
- Kiểm tra: 24 mục catalog hợp lệ; 6 ảnh cảnh/cận 1672×941; sách 1280×1280 có alpha; SVG/JSON phân tích được; WAV mono 24kHz, sample peak dưới -1 dBFS. Không đo LUFS hoặc true peak của bản phối game.
- Đã mở preview trên trình duyệt, bật lớp bóng/điểm bấm và chuyển ô kỹ thuật sang trạng thái có sách; ảnh được tải thành công.
- Chưa kiểm tra trong game vì chưa có ứng dụng gameplay trong dự án. Chưa duyệt cảm nhận âm thanh trên tai nghe/loa.

## Quy tắc bản sau

Mỗi lần thay ghi ngày, ID, phiên bản cũ/mới, lý do thay, nguồn/prompt mới, thay đổi tọa độ điểm bấm, kết quả kiểm tra. Giữ nguyên ID logic; không xóa v1 trước khi bản thay được xác nhận.
