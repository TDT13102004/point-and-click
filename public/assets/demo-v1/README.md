# Bộ assets demo An Linh — v1

Ngày tạo: 16/11/2026. Bối cảnh: khu tập thể An Vân hư cấu tại Hà Nội. Bộ này phục vụ đoạn mở đầu đến lúc lấy sách đỏ ở căn 1305, chưa phải toàn bộ game.

## Bắt đầu ở đâu

- Mở `preview.html` bằng trình duyệt để xem hình, bật/tắt bóng và lớp camera, thử âm thanh. Đây là thư viện xem assets, không phải game hoàn chỉnh.
- `manifest.json`: danh mục máy đọc, mã asset ổn định, đường dẫn, mục đích, nguồn, kích thước, mã kiểm tra file và trạng thái.
- `integration.json`: điểm bấm gợi ý và cấu hình các trạng thái. Tọa độ chuẩn hóa theo ảnh, phải kiểm tra lại khi thay ảnh.
- `prompts/all-prompts.json`: nguyên văn prompt đã dùng và chuỗi hình tham chiếu.
- `documents/demo-documents.json`: văn bản kết nối viết riêng cho demo; tách khỏi hình để sửa tiếng Việt dễ dàng.
- `qa-report.json`, `contact-sheet.png`: kết quả kiểm tra và bảng xem ảnh.

## Các loại asset

| Mã | File | Là gì / dùng ở đâu | Thay lại thế nào |
| --- | --- | --- | --- |
| BG-1305 | backgrounds/bg-1305-v1.png | Cảnh chính phòng sinh hoạt; nhìn thấy cửa sổ, bàn, ô kỹ thuật và cửa phòng ngủ | Dùng prompt `room` và ảnh người dùng trong references/images; giữ góc máy/điểm tương tác hoặc cập nhật integration.json |
| BG-CORRIDOR | backgrounds/bg-corridor-v1.png | Hành lang tầng 13, dùng cho camera hoặc điều hướng | Prompt `corridor`; giữ phía căn hộ bên phải, hành lang mở bên trái |
| BG-STATION | backgrounds/bg-station-v1.png | Chiếu nghỉ tầng 12, bàn laptop của An Linh | Prompt `station`; màn hình laptop để trống, giao diện thật dựng riêng |
| CL-HATCH-CLOSED | closeups/cl-hatch-closed-v1.png | Cận ô kỹ thuật trước khi mở | Prompt `hatch`, dùng BG-1305 làm tham chiếu |
| CL-HATCH-OPEN | closeups/cl-hatch-open-v1.png | Ô mở, có sách đỏ | Prompt `hatch_open`, tham chiếu ảnh đóng và vật phẩm sách |
| CL-HATCH-EMPTY | closeups/cl-hatch-empty-v1.png | Ô mở sau khi lấy sách | Prompt `hatch_empty`, chỉnh từ ảnh ô mở |
| PROP-RED-BOOK | props/prop-red-book-v1.png | Sách đỏ nền trong suốt cho khay vật phẩm hoặc xem cận | Prompt `book`; giữ bìa trơn, chữ và nội dung sách dựng bằng code |
| MAP-F13 | maps/map-floor13-v1.svg | Sơ đồ điều tra hư cấu, có 1301–1319, cầu thang và hai camera | Sửa nguồn trong tools/build-demo-assets.py rồi dựng lại |
| OV-SHADOW | overlays/ov-shadow-v1.svg | Bóng người mờ dạng vector, bản tạm | Thay bằng PNG/WebP alpha hoặc vector mới; chỉnh hộp đặt bóng và độ mờ |
| OV-VIGNETTE | overlays/ov-vignette-v1.svg | Viền tối, không đổi hình học cảnh | Điều chỉnh opacity theo trạng thái |
| OV-CCTV | overlays/ov-cctv-v1.svg | Dòng quét camera tĩnh | Có thể bỏ; không chứa số giờ hay tên camera |
| ICON-* | icons/*.svg | 5 biểu tượng hồ sơ, camera, ghi âm, ghi chú, sách | SVG 96×96, nét đơn, dùng như ảnh hoặc đổi màu trong code |
| AMB-ROOM | audio/amb-room-tone-v1.wav | Nền điện phòng tuần hoàn 12 giây | Thay bằng bản thu riêng có đoạn nối mượt, vẫn để gain thấp |
| SFX-STATIC | audio/sfx-recorder-static-v1.wav | Nhiễu máy ghi âm | Thay bằng bản thu hoặc hiệu ứng mới |
| SFX-KNOCK | audio/sfx-three-knocks-v1.wav | Ba tiếng gõ; cue 0.35 / 0.90 / 1.45 giây | Giữ cue hoặc cập nhật cả hình phụ đề/tín hiệu hình ảnh |
| SFX-CREAK | audio/sfx-door-creak-v1.wav | Tiếng cửa tổng hợp | Nên thay bằng tiếng cửa thật ở bản sau |
| SFX-PAPER | audio/sfx-paper-v1.wav | Tiếng giấy tạm | Nên thay bằng bản thu giấy |
| VOICE-EVP | audio/voice-evp-placeholder-v1.wav | Giọng tiếng Việt tổng hợp tạm: “Đừng nhìn phía sau. Cuốn sách. Trong vách.” | Giọng hệ thống macOS Linh; giữ bản chép đồng bộ, ưu tiên thay bằng bản thu có quyền sử dụng rõ |
| SFX-CLICK | audio/sfx-ui-click-v1.wav | Nút thiết bị | Có thể thay độc lập, không làm manh mối |
| DOCS-DEMO | documents/demo-documents.json | Ghi chú chìa khóa, mảnh giấy trong sách, bản chép EVP tạm | Sửa văn bản; không cần tạo lại hình |

## Trạng thái kinh dị

`integration.json` quy định các trạng thái bằng ảnh nền + lớp phủ; không vẽ lại toàn bộ phòng cho mỗi biến thể. Bóng người hiện là hình mờ để thử vị trí. Giao diện preview có thể cho thấy bóng rõ hơn mức cần dùng thực tế.

Đèn tắt, ghế đổi hướng, cửa đóng/mở chưa có các lớp vật thể tách riêng. Không hứa rằng ảnh phòng hiện tại hỗ trợ trực tiếp những thao tác này. Nếu cần, phải tạo thêm asset có cùng góc máy và cập nhật danh mục. Ảnh phòng hiện có cửa phòng ngủ mở, dù brief cũ nói khép hờ.

## Giới hạn cần biết trước khi dùng

- Hình nền và sách được AI tạo bằng công cụ image_gen tích hợp. Lưu prompt nguyên văn; tạo lại sẽ có khác biệt, không thể bảo đảm giống từng pixel.
- Ba trạng thái ô kỹ thuật là các lần chỉnh AI. Có thể lệch nhẹ vít/khung/bề mặt; dùng chuyển cảnh ngắn thay vì hoạt ảnh cơ khí yêu cầu khớp tuyệt đối.
- Ảnh cận dùng đầu vít chữ thập; hình rộng chỉ thể hiện chấm vít. Chưa dùng số lượng/loại vít làm câu đố.
- Sơ đồ toàn tầng là hư cấu và không theo tỷ lệ. Ảnh hành lang chỉ là một đoạn, chưa đủ thể hiện 19 căn. Chốt lại sơ đồ nếu mở rộng khám phá toàn tầng.
- Ba cảnh đang ở mức đọc được trong ánh sáng chạng vạng. Chữ biển căn hộ, nhãn camera và giờ quay phải được thêm bằng code; không coi biển trống là manh mối.
- 6 WAV là hiệu ứng tổng hợp bằng mã, không phải bản thu hiện trường. Có thêm một đoạn giọng EVP tổng hợp bằng giọng hệ thống macOS Linh; chưa có diễn viên đọc EVP, nhạc nền, bước chân hoặc đối thoại. Điều khoản phát hành thương mại của giọng hệ thống chưa được đánh giá; nên thay bằng bản thu riêng trước khi phát hành. Bản chép EVP cũng chưa phải câu đố tiếng Việt hoàn chỉnh.
- Không có cảnh riêng bếp/phòng ngủ, gara, căn 1313 hoặc nghi thức; phạm vi hình hiện tại chỉ đủ bản mở đầu tối giản.
- Các file nguồn truyện và QR cũ được giữ nguyên. Không đưa QR gốc hoặc mã tiếng Anh vào game chỉ vì chúng có sẵn.
- Đã kiểm tra kỹ thuật file và xem hình; chưa có ứng dụng game để xác nhận điểm bấm, phối âm hoặc mức sợ khi chơi thực tế. Trạng thái `demo-placeholder` được giữ cho đến khi người dùng duyệt.

## Nguồn và quyền sử dụng

- Ảnh căn hộ do người dùng cung cấp: `references/images/can-1305-noi-that-reference.png`. Chưa rõ tác giả/giấy phép. Ảnh này chỉ làm đầu vào định hướng; không đóng gói ảnh gốc thành asset game.
- Nguồn tham khảo kiến trúc: `references/web-reference.md` và `references/pinterest-reference.md`. Không lấy ảnh báo/Pinterest để ghép trực tiếp vào bộ này.
- Sơ đồ, SVG và WAV do mã trong dự án tạo. Nội dung ghi chú mới hoặc phỏng theo truyện đã có được ghi rõ trong JSON.
- Bộ demo chưa phải xác nhận quyền phát hành toàn bộ câu chuyện hoặc tư liệu gốc. Không ghi nhãn tài nguyên AI là ảnh chụp thật hoặc CC0.

## Quy trình thay asset về sau

1. Giữ mã ID; tạo tên mới `...-v2.png` thay vì ghi đè v1.
2. Cập nhật đường dẫn, phiên bản, prompt/nguồn, kích thước và nguồn tham chiếu trong danh mục.
3. Nếu góc máy thay đổi, cập nhật các điểm bấm, hộp đặt bóng và sơ đồ.
4. Chạy lại kiểm tra ảnh, xem trên nền sáng/tối với vật phẩm alpha, nghe thử WAV; kiểm tra tiếp trong game.
5. Đánh dấu asset cũ đã thay, giữ bản cũ cho đến khi bản mới hoạt động ổn.

Dựng lại SVG/WAV và catalog: chạy `python3 tools/build-demo-assets.py` từ gốc dự án. Lệnh này không tạo lại ảnh AI, không đổi file truyện. Catalog dựng lại sẽ reset xác nhận kiểm tra ảnh; chạy tiếp `tools/validate-demo-assets.py` bằng Python có Pillow. Để đổi v2, cập nhật đường dẫn trong công cụ dựng hoặc danh mục sau khi dựng; không chạy lại công cụ cũ rồi vô tình trỏ lại v1.
