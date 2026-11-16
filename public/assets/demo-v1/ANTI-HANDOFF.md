# Ghi chú bàn giao cho Antigravity

Đọc README.md, manifest.json và integration.json trong thư mục này trước khi tích hợp.

1. Dùng ID trong manifest để ánh xạ file. Bối cảnh hiện hành là khu tập thể An Vân Hà Nội, không phải khách sạn Đà Lạt.
2. Ưu tiên assets đã tạo ở đây thay vì tự tải hình web. Chưa có game hoàn chỉnh trong bộ assets.
3. Dựng màn hình laptop và chữ tài liệu bằng code. Laptop trong BG-STATION chỉ là hình nền chuyển cảnh; không ép các ứng dụng chạy vào màn hình phối cảnh nhỏ.
4. Render ảnh giữ nguyên tỷ lệ. Tọa độ điểm bấm chỉ tính theo vùng ảnh thật, không theo phần letterbox hoặc toàn viewport.
5. CL-HATCH-CLOSED → CL-HATCH-OPEN → CL-HATCH-EMPTY. PROP-RED-BOOK dùng cho inventory; không đặt sách thêm lên ảnh open vì ảnh đó đã có sách.
6. Bóng người/viền tối/dòng quét là lớp riêng. Giữ cường độ nhẹ; mặc định tắt nhấp nháy. Các trạng thái cửa và ghế chưa có assets tách lớp.
7. Âm thanh chỉ phát sau tương tác của người chơi, có mute/volume. Đoạn EVP tạm không chứa lời giải số phòng; đừng mặc định tiếng gõ là mã 1305. Câu đố mới cần được thiết kế riêng và có gợi ý trong game.
8. Văn bản demo-documents.json là bản tạm viết thêm; phần truyện chuẩn vẫn ở viet-hoa-viet-nam. Không dùng nội dung kết thúc làm hồ sơ mở đầu.
9. Cảnh phòng ngủ/bếp riêng, góc đảo chiều camera, gara, phòng 1313 và nghi thức chưa có. Không ghi trong báo cáo rằng đã đủ assets toàn game.
10. Khi tạo bản mới, lưu file v2, giữ ID, ghi thay đổi vào CHANGELOG và cập nhật manifest/hotspots. Không thay thế ảnh người dùng hoặc tài liệu truyện nguồn.
