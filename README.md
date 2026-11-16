# AN LINH — BÓNG NGƯỜI TẦNG 13 (Bản Demo v4: Point-and-Click & Inventory)

Bản demo web game điều tra kinh dị point-and-click (React + TypeScript + Vite) tại **Khu tập thể An Vân — Khối C, Hà Nội**. Người chơi di chuyển trực tiếp giữa 3 cảnh (**Chiếu nghỉ tầng 12**, **Hành lang tầng 13**, **Căn hộ 1305**), thu thập vật chứng vào **Túi đồ (Inventory)** ở cạnh dưới màn hình, và tương tác trực tiếp trên hiện trường.

---

## 1. Cách mở và chạy game

### Chạy bản build sẵn (`game/dist/`)
Từ thư mục gốc dự án (`casefree/`):
```bash
python3 -m http.server 4173 --directory game/dist
```
Sau đó mở trình duyệt tại `http://localhost:4173`.

### Chạy môi trường phát triển hoặc build lại
```bash
cd game
npm install
npm run dev
npm run build
```

---

## 2. Cơ chế Point-and-Click, Inventory & Lời giải cho người phát triển

> Thông tin dưới đây chỉ dành cho người phát triển/kiểm thử, **không hiển thị trên giao diện người chơi**.

- **Tài liệu đã loại bỏ**: Không còn `04.png`, `05.png`, `11.png` (các trang chỉ chứa mã QR).
- **Túi đồ (Inventory) cạnh dưới**:
  - Sẵn có: **Hồ sơ vụ án** (`01`, `02`, `03`, `06`), **Máy ghi âm EVP** (`09`, mở thêm `12`), **Bảng dụng cụ** (`10`).
  - Nhặt tại hiện trường: **Mảnh vách khắc** (`07`), **Ảnh chụp Graffiti** (`08`), **Sách đỏ** (`13`), **Đĩa than cũ** (`14`), **Bức thư 1313** (`15`), **Hồ sơ kết thúc** (`16`).

| Cảnh & Điểm bấm Point-and-Click | Tương tác / Câu đố | Đáp án chuẩn | Mở khóa |
| --- | --- | --- | --- |
| **Tầng 12** → **Cầu thang lên tầng 13** | Di chuyển thẳng lên Hành lang tầng 13 | *(Di chuyển)* | Mở cảnh **Hành lang 13** |
| **Hành lang 13** → **Vách thạch cao tháo dỡ** | Nhặt vật chứng `07.png` | *(Nhặt vật phẩm)* | Thêm **Mảnh vách khắc** vào Inventory |
| **Hành lang 13** → **Mảng tường có chữ vẽ** | Chụp/lấy vật chứng `08.png` | *(Nhặt vật phẩm)* | Thêm **Ảnh chụp Graffiti** vào Inventory |
| **Hành lang 13** → **Bóng người trên hành lang** | Hai bóng người là ai? (`02` + `06` + `07` + `08`) | `athenafargo` | Thêm **Bản ghi âm EVP 2 (`12.png`)** |
| **Hành lang 13** → **Cửa phòng 1305** | Cần đọc vật gì & tìm ở phòng nào? (`09`) | `redbookfive` | Mở khóa & bước vào **Căn 1305** |
| **Căn 1305** → **Ô kỹ thuật trên vách** | Mở nắp → lấy Sách đỏ | *(Tương tác trực tiếp)* | Thêm **Sách đỏ (`13.png`)** vào Inventory |
| **Tầng 12** → **Cửa sổ xuống nhà để xe** | Tìm chiếc xe nào trong nhà để xe? (`13`) | `irqobt` | Thêm **Đĩa than cũ (`14.png`)** vào Inventory |
| **Hành lang 13** → **Cửa phòng 1313** (lần 1) | Hai bóng người đã làm gì? (`12` + `14`) | `summonedsomething` | Thêm **Bức thư 1313 (`15.png`)** vào Inventory |
| **Hành lang 13** → **Phòng 1313 — Thanh tẩy tầng 13** (lần 2) | Thực hiện nghi thức thanh tẩy tại tầng 13 (`15` + `10`) | `qnktgs` | Thêm **Hồ sơ kết thúc (`16.png`)** & Hoàn thành |

---

## 3. Lưu tiến độ (`localStorage`)
- Khóa lưu trữ phiên bản v4: `an_linh_demo_v4_state`.
- Tự động dọn các khóa lưu cũ (`v1`, `v2`, `v3`) khi khởi tạo hoặc khi nhấn **Chơi lại**.
