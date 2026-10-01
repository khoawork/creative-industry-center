# Founder Page API Context

## 1. Tổng quan

Founder Page API quản lý nội dung trang Founder. API được triển khai bằng Flask Blueprint:

- Blueprint: `founder_page_api`
- Prefix: `/founder-page`
- Slug trang được service sử dụng cố định: `founder`
- Blueprint được đăng ký trong `backend/app.py`
- Dữ liệu được lưu trong bảng `page`, cột JSON `props`

Luồng xử lý chung:

```text
HTTP request
  -> founder_controller.py
  -> Marshmallow DTO load/dump
  -> founder_services.py
  -> founder_repository.py
  -> Page.props JSON
```

Phản hồi thành công và lỗi dùng các helper trong `backend/utils/json.py`.

## 2. Các endpoint hiện có

### Page

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/founder-page/` | Lấy toàn bộ Founder Page |

### Hero

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/founder-page/hero` | Tạo/cập nhật dữ liệu hero |
| `PATCH` | `/founder-page/hero` | Cập nhật hero đã tồn tại |

Service tương ứng:

- `get_page_by_slug`
- `create_hero_section`
- `update_hero_section`

Hero được lưu tại `props.hero_section` và có id mặc định `hero_1`.

### Founder sections

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/founder-page/sections` | Tạo founder section |
| `PATCH` | `/founder-page/sections/<section_id>` | Cập nhật founder section |
| `DELETE` | `/founder-page/sections/<section_id>` | Xóa founder section và đánh lại id |

Service tương ứng:

- `create_founder_section`
- `update_founder_section`
- `delete_founder_section`

Các section được lưu trong `props.section` dưới dạng list. ID được tạo theo dạng `section_1`, `section_2`, ...

### CTA

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/founder-page/cta` | Lấy CTA |
| `POST` | `/founder-page/cta` | Tạo CTA |
| `PATCH` | `/founder-page/cta` | Cập nhật CTA |

Service tương ứng:

- `get_founder_cta`
- `create_founder_cta`
- `update_founder_cta`

CTA được lưu tại `props.cta_section`. API hiện không có endpoint xóa CTA.

### Certificates

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/founder-page/cta/certificates` | Lấy danh sách certificate |
| `POST` | `/founder-page/cta/certificates` | Tạo certificate |
| `PATCH` | `/founder-page/cta/certificates/<certificate_id>` | Cập nhật certificate |
| `DELETE` | `/founder-page/cta/certificates/<certificate_id>` | Xóa certificate và đánh lại id |

Service tương ứng:

- `get_founder_certificates`
- `create_founder_certificate`
- `update_founder_certificate`
- `delete_founder_certificate`

Certificate được lưu trong `props.cta_section.certificate` với ID dạng `certificate_1`, `certificate_2`, ...

## 3. Payload chính

### Hero request

```json
{
  "title": "Người đứng sau thương hiệu",
  "description": "Khám phá câu chuyện và hành trình của những người sáng lập.",
  "name": "Đội ngũ sáng lập",
  "number_of_founders": 2,
  "subtitle": "Những người đứng sau thương hiệu",
  "subdescription": "Hai nhà sáng lập cùng chung tầm nhìn."
}
```

### Founder section request

```json
{
  "major": "Founder & CEO",
  "name": "Nguyễn Văn A",
  "description": "Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ.",
  "founder_info": [
    {
      "label": "Chức danh",
      "value": "Founder & CEO"
    }
  ],
  "is_verified": true,
  "image": "/images/founder/founder-1.jpg",
  "founder_profile": {
    "filter": "bio",
    "title": "Tiểu sử & Triết lý",
    "description": "Tôi tin rằng công nghệ cần được xây dựng dựa trên những giá trị thực tế.",
    "slogan": "Build with purpose.",
    "sub_slogan": "Kiến tạo hôm nay, hướng đến tương lai."
  }
}
```

`founder_profile.filter` chỉ nhận một trong các giá trị:

- `bio`
- `projects`
- `achievements`

### CTA request

```json
{
  "subtitle": "Cùng chúng tôi tạo nên giá trị",
  "title": "Bắt đầu hành trình mới",
  "description": "Hãy kết nối với chúng tôi để cùng khám phá những cơ hội hợp tác.",
  "btn_cta": "Liên hệ ngay",
  "sub_btn_cta": "Tìm hiểu thêm về chúng tôi",
  "certificate": [
    {
      "name": "ISO 9001"
    }
  ]
}
```

### Certificate request

```json
{
  "name": "ISO 9001"
}
```

## 4. Quy tắc ID và xử lý dữ liệu

- Hero dùng `hero_1`.
- CTA dùng `cta_1`.
- Section và certificate tạo ID dựa trên số lượng phần tử hiện có.
- Khi xóa section hoặc certificate, service đánh lại ID từ `1`.
- `update_*` giữ ID hiện tại, không lấy ID từ request body.
- Nếu không tìm thấy page, section, hero, CTA hoặc certificate, service ném `ValueError`; controller trả HTTP `404`.
- Payload không hợp lệ qua Marshmallow tạo `ValidationError`; controller trả HTTP `400`.

## 5. Cấu trúc dữ liệu trong `Page.props`

```json
{
  "hero_section": {},
  "section": [],
  "cta_section": {
    "certificate": []
  }
}
```

Model liên quan là `backend/models/PageModel.py`:

- `id`: khóa chính
- `name`: tên page
- `slug`: slug, Founder dùng `founder`
- `props`: JSON chứa toàn bộ nội dung page

## 6. Lưu ý khi phát triển

1. `backend/docs/swagger/founder.yaml` hiện còn mô tả các route đã bị bỏ trong controller:
   - `GET /founder-page/sections`
   - `DELETE /founder-page/hero`
   - `DELETE /founder-page/cta`

   Swagger cần được cập nhật nếu dùng làm tài liệu chính thức.

2. Schema `FOUNDER_CTA_SCHEMA` trong controller yêu cầu `form_url`, và `FounderCTAResponseDto` cũng yêu cầu `form_url`, nhưng `FounderCTADto` hiện chưa khai báo trường này. Cần thống nhất trước khi gọi API CTA.

3. `create_hero_section` hiện ghi đè hero hiện có thay vì kiểm tra đã tồn tại hay chưa.

4. `founder_repository.py` có hai định nghĩa `get_page_by_slug`; định nghĩa phía sau đang ghi đè định nghĩa phía trước. Nên giữ lại một định nghĩa để tránh nhầm lẫn.

5. `backend/app.py` tạo app ngay khi module được import qua `app = create_app()`. Khi chạy, cần bảo đảm dependencies và database đã sẵn sàng.

## 7. Chạy và kiểm tra

Từ thư mục `backend`:

```powershell
pip install -r requirements.txt
py app.py
```

Kiểm tra syntax các file Founder:

```powershell
python -m py_compile controllers/pages/founder_controller.py services/pages/founder_services.py
```

API mặc định chạy tại port được cấu hình trong biến môi trường `PORT`, mặc định là `5000`.
