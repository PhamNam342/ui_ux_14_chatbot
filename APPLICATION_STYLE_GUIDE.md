# MedConsult Application Style Guide

Style guide này dùng làm chuẩn thiết kế và triển khai UI cho ứng dụng MedConsult ở ba vai trò: Patient, Doctor và Admin. Mục tiêu là giữ giao diện nhất quán, chuyên nghiệp, dễ quét thông tin và phù hợp bối cảnh healthcare SaaS.

## 1. Design Principles

### Rõ ràng trước, trang trí sau

MedConsult là ứng dụng y tế, vì vậy UI phải giúp người dùng hiểu nhanh:

- Mình đang ở vai trò nào.
- Đang xem dữ liệu của ai hoặc cơ sở nào.
- Trạng thái hiện tại là gì.
- Hành động tiếp theo nên bấm ở đâu.

Không dùng bố cục quá “marketing”, card quá nhiều lớp, gradient trang trí, hoặc hiệu ứng làm phân tán sự chú ý.

### Healthcare SaaS

Giao diện nên có cảm giác:

- Sạch.
- Tin cậy.
- Bình tĩnh.
- Dễ thao tác lặp lại.
- Phân cấp thông tin tốt.

Admin và Doctor cần layout thiên về vận hành, bảng, bộ lọc, danh sách, trạng thái. Patient có thể mềm hơn, thân thiện hơn, nhưng vẫn phải rõ ràng.

### Realtime feedback

Mọi thao tác thay đổi dữ liệu nên có phản hồi:

- Toast ngắn.
- Trạng thái loading/disabled.
- Highlight nhẹ vùng vừa cập nhật.
- Badge trạng thái rõ ràng.

## 2. Color System

### Core Palette

| Token | Value | Usage |
|---|---:|---|
| Page background | `#F8FAFC` | Nền tổng thể |
| Surface | `#FFFFFF` | Card, table, panel |
| Primary | `#0F766E` | CTA chính, active state |
| Primary soft | `#CCFBF1`, `#ECFDF5` | Active background, success healthcare tint |
| Border | `#E2E8F0` | Card/table/input border |
| Text primary | `#0F172A` | Heading, nội dung quan trọng |
| Text secondary | `#64748B` | Subtitle, metadata |
| Text muted | `#94A3B8` | Helper text, inactive labels |
| Danger | `#DC2626` | Hủy, lỗi, mức độ cao |
| Warning | `#D97706` | Cảnh báo, trung bình |
| Success | `#16A34A` | Hoàn tất, đang áp dụng |
| Info | `#2563EB` | Thông tin phụ |

### Usage Rules

- Primary teal chỉ dùng cho hành động chính, trạng thái active và điểm nhấn quan trọng.
- Không dùng một trang chỉ toàn teal. Cần có neutral, slate, white và một vài màu semantic.
- Badge trạng thái phải dùng màu theo ý nghĩa, không dùng ngẫu nhiên.
- Không dùng gradient tím/xanh đậm làm theme chính.

## 3. Typography

Font chính: `Inter`.

### Recommended Sizes

| Element | Size | Weight | Color |
|---|---:|---:|---|
| Page title | `32–36px` | `700–800` | `#0F172A` |
| Page subtitle | `15–16px` | `400–500` | `#64748B` |
| Section/Card title | `20–22px` | `700` | `#0F172A` |
| Table header | `12–13px` | `700` | `#64748B` |
| Table body | `14px` | `500–600` | `#334155` |
| Important row title | `15–16px` | `600–700` | `#0F172A` |
| Metadata | `13–14px` | `500–600` | `#94A3B8` |
| Price/metric | `16–22px` | `700` | `#0F172A` |
| Badge | `12–13px` | `600–700` | semantic |
| Button | `14–15px` | `600–700` | depends on variant |

### Rules

- Không dùng font quá lớn trong bảng.
- Không dùng negative letter spacing.
- Table header có thể uppercase với letter spacing nhẹ.
- Text trong button không được xuống dòng trừ khi là mobile layout.
- Các từ dài phải được truncate hoặc layout phải đủ rộng.

## 4. Layout

### Page Structure

Một page chuẩn nên có:

1. Header: title, subtitle, primary action nếu có.
2. Summary/KPI hoặc selected context header nếu cần.
3. Filter/search area.
4. Main working surface: table/list/calendar/chat.
5. Detail drawer/modal khi cần drill down.

### Spacing

| Use case | Gap |
|---|---:|
| Page sections | `24–32px` |
| Card internal padding | `16–24px` |
| Table cell padding | `12–16px` |
| Form field gap | `10–14px` |
| Button/icon gap | `6–8px` |

### Cards

- Border radius nên giữ khoảng `8–16px`.
- Không đặt card trong card nếu không thật sự cần.
- Card dùng để nhóm thông tin có ranh giới rõ: KPI, table panel, list item, modal.
- Section lớn không nên làm nổi như card nếu chỉ là vùng layout.

### Responsive

- Mobile ưu tiên single column.
- Table rộng nên dùng horizontal scroll hoặc đổi thành card list.
- Toolbar filter phải wrap tốt, không ép text hoặc button.
- Fixed-format UI như calendar, table, segmented control cần min/max width rõ ràng.

## 5. Components

### Buttons

Variants:

- Primary: nền `#0F766E`, chữ trắng. Dùng cho hành động chính.
- Outline: nền trắng, border `#CBD5E1`, chữ slate/teal.
- Ghost: nền trong suốt hoặc rất nhạt, dùng cho hành động phụ.
- Danger: đỏ cho hủy/xóa.

Rules:

- Hành động chính phải nổi bật hơn icon phụ.
- Không dùng icon-only nếu hành động dễ nhầm như “Lưu giá”, “Xác nhận”, “Hủy lịch”.
- Icon-only chỉ dùng cho thao tác quen thuộc: đóng, xem, lịch sử, more menu.
- Disabled phải rõ nhưng vẫn đọc được.

### Inputs & Filters

- Input cao tối thiểu `40–44px`.
- Filter quan trọng nhất đặt bên trái.
- Filter phụ có thể là dropdown.
- Luôn có Reset/Bỏ lọc nếu filter có nhiều hơn một điều kiện.
- Placeholder nên mô tả đúng dữ liệu: “Tên bệnh nhân / SĐT / mã ca”.

### Tables

Rules:

- Header nhỏ, uppercase, màu secondary.
- Cột tên/chủ thể chính phải rộng nhất.
- Cột hành động căn phải.
- Không hiển thị input edit mặc định trên tất cả row.
- Inline edit phải có `Lưu` và `Hủy` rõ ràng.
- Row hover dùng nền teal rất nhạt.

### Badges

Badge dùng cho:

- Trạng thái.
- Ưu tiên.
- Loại dịch vụ.
- Mức độ.

Mapping:

- Cao/Critical: red/rose.
- Trung bình/Warning: amber/yellow.
- Thấp/Stable: green/teal.
- Đã xác nhận/Hoàn tất: green.
- Chờ duyệt/Chờ xác nhận: amber.
- Đã hủy/Tạm ngưng: red/slate tùy ngữ cảnh.

### Modals & Drawers

- Modal dùng cho tạo/sửa/xác nhận.
- Drawer dùng cho xem chi tiết hồ sơ, lịch sử, ca khám.
- Header phải nêu rõ đối tượng đang xem.
- Footer chứa hành động chính/phụ.
- Click backdrop đóng modal chỉ khi không gây mất dữ liệu đang nhập.

## 6. Role-Specific Guidelines

### Patient

Tone:

- Thân thiện.
- Trấn an.
- Dễ hiểu.

UI:

- CTA rõ: Đặt lịch, Chuyển sang bác sĩ, Gửi tin nhắn.
- Flow nhiều bước cần progress và auto-scroll.
- Summary bên phải hoặc dưới cùng phải cập nhật realtime.
- Nội dung y tế nên có helper text, không quá kỹ thuật.

Important patterns:

- Booking flow: Cơ sở → Chuyên khoa → Bác sĩ → Lịch khám → Xác nhận.
- Khi đổi bước trước, reset dữ liệu bước sau.
- Mỗi bước mới nên được highlight nhẹ.

### Doctor

Tone:

- Tập trung.
- Nhanh.
- Ưu tiên bệnh nhân cần xử lý.

UI:

- Sidebar font và spacing phải nhất quán.
- Dashboard ưu tiên danh sách chờ và lịch trong ngày.
- “Xem hồ sơ” phải đưa đến trang Bệnh nhân với filter đúng bệnh nhân.
- Mức độ bệnh nhân nên dùng dropdown khi filter space hạn chế.
- Lịch ngày/tuần/tháng phải dùng cùng width container.

Important actions:

- Bắt đầu tư vấn.
- Xem hồ sơ.
- Kê đơn.
- Tạo ghi chú.
- Dời lịch hoặc xác nhận lịch.

### Admin

Tone:

- Vận hành.
- Chính xác.
- Dễ quét dữ liệu lớn.

UI:

- Header context phải rõ: đang xem cơ sở nào, bảng giá nào, bác sĩ nào.
- Filter đầu tiên phải là filter quan trọng nhất.
- Table không nên quá chữ lớn.
- KPI không được lặp thông tin đã có trong selected context header.
- Inline edit cần Hủy và Lưu rõ.

Important pages:

- Quản lý cơ sở.
- Quản lý bác sĩ.
- Quản lý ca khám.
- Bảng giá theo cơ sở.
- Báo cáo doanh thu.
- Chất lượng dịch vụ.

## 7. Interaction Rules

### Smooth Scroll

Khi flow có nhiều bước, dùng:

```js
element.scrollIntoView({ behavior: 'smooth', block: 'start' })
```

Nếu có sticky header, section cần:

```css
scroll-margin-top: 80px;
```

### Highlight New Section

Khi người dùng hoàn tất bước và hệ thống chuyển sang bước tiếp theo:

- Border teal nhạt.
- Shadow nhẹ.
- Fade-in khoảng `300ms`.

### Inline Edit

Inline edit phải có:

- Nút Sửa.
- Input chỉ xuất hiện khi đang sửa.
- Nút Lưu nổi bật khi có thay đổi.
- Nút Hủy để thoát nếu bấm nhầm.
- Không ép người dùng phải sửa dữ liệu mới thoát được.

### Toast

Toast nên:

- Ngắn.
- Nêu kết quả: “Cập nhật giá thành công”.
- Tự ẩn sau `2–3s`.
- Không che CTA chính.

## 8. Icons

Use `lucide-react`.

Rules:

- Dùng icon trong button khi icon giúp nhận diện hành động.
- Kích thước phổ biến: `14–18px`.
- Sidebar icon: `18px`.
- Icon-only button cần `title` hoặc `aria-label`.
- Không tự vẽ SVG icon nếu lucide đã có.

## 9. Accessibility

- Button phải là `<button type="button">` nếu không submit form.
- Input cần label hoặc aria-label.
- Icon-only action cần `aria-label`.
- Màu không phải tín hiệu duy nhất; badge nên có text.
- Focus state phải thấy rõ.
- Text contrast tối thiểu phải đủ đọc trên nền nhạt.

## 10. Wireframe Standard

Wireframe trong folder `wireframe` dùng grayscale low-fidelity:

- Dùng rectangle, line, circle, placeholder X-box.
- Không dùng màu brand trong wireframe.
- Có browser frame nếu muốn giống reference sketch.
- File SVG phải import được vào Figma.
- Nên có generator script để regenerate.

Folder hiện tại:

- `wireframe/patient`
- `wireframe/doctor`
- `wireframe/admin`

## 11. Do / Don’t

### Do

- Làm rõ context đang xem.
- Giữ filter logic dễ hiểu.
- Dùng table/list gọn cho admin/doctor.
- Làm CTA chính nổi bật.
- Dùng badge semantic.
- Kiểm tra responsive trước khi hoàn tất.

### Don’t

- Không dùng font quá to trong bảng.
- Không lặp KPI ở nhiều nơi trong cùng viewport.
- Không để input edit hiện trên mọi row.
- Không để button lưu bị chìm cạnh icon phụ.
- Không dùng card chồng card.
- Không làm giao diện quá một màu.
- Không để tab cùng cấp có width khác nhau nếu chúng cùng một page.

## 12. QA Checklist

Trước khi merge UI:

- Page title/subtitle đúng phân cấp.
- Filter chính nằm đầu hàng.
- Có reset filter nếu cần.
- CTA chính nổi bật.
- Table column không bóp nội dung chính.
- Text không overflow.
- Mobile layout không vỡ.
- Hover/focus/disabled states đủ rõ.
- Empty state có hướng dẫn hành động.
- Build pass.
- Lint pass với file vừa sửa.
