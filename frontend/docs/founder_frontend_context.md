# Founder Frontend Context

## 1. Mục đích tài liệu

Tài liệu này mô tả ngữ cảnh frontend hiện tại của tính năng Founder, làm cơ sở để xây dựng trang quản lý nội dung trong khu vực Admin.

Phạm vi gồm:

- Founder public page.
- Các component hiển thị Founder.
- Style và design convention hiện tại.
- Admin shell và route quản lý Founder.
- Mock data, data flow và các điểm cần chuẩn hóa trước khi kết nối backend.

## 2. Stack frontend

- React 19.
- Vite.
- React Router.
- Tailwind CSS.
- `lucide-react` và `react-icons`.
- Oxlint.

Entry chính:

- `src/main.jsx`: khởi tạo React, `StrictMode`, `BrowserRouter`.
- `src/App.jsx`: tách public shell và admin shell.
- `src/routes/index.jsx`: khai báo public route và Admin route.

Scripts chính:

```powershell
npm run dev
npm run build
npm run lint
```

## 3. Public Founder page

Entry page:

- `src/pages/founder-story.jsx`

Route hiện tại:

```text
/stories
```

Page đang sử dụng dữ liệu tĩnh từ:

- `src/data/founderStoriesData.js`

Luồng component:

```text
FounderStory
  -> Introduction
  -> StoryFilter
  -> FounderStoryList
      -> FounderCard
  -> StoryCTA
  -> SubmitStoryModal
  -> RecordEvaluationModal
```

### State ở FounderStory

`FounderStory` đang quản lý:

- `selectedCategory`: category hiện tại, mặc định `all`.
- `searchTerm`: từ khóa tìm kiếm.
- `isSubmitModalOpen`: trạng thái modal gửi câu chuyện.
- `isEvaluationModalOpen`: trạng thái modal đánh giá hồ sơ.

Danh sách được lọc bằng `useMemo` theo:

- Tên Founder.
- Chức danh hoặc tiêu đề.
- Tên category.
- Badge text.
- Nội dung `tabs.about.content`.

Hiện page chưa có:

- API loading state.
- API error state.
- Server-side search.
- Pagination.
- Sort.
- Tổng số bản ghi từ backend.

## 4. Founder data shape hiện tại

Mock story hiện có shape tương tự:

```text
{
  id,
  category,
  badgeText,
  categoryLabel,
  name,
  title,
  image,
  meta: [],
  tabs: {
    about: {
      title,
      content,
      quote,
      quoteAuthor
    },
    journey: {},
    achievements: {}
  }
}
```

`CATEGORIES` gồm các nhóm:

- `all`.
- `craft`.
- `cosmetics`.
- `tech`.
- `fashion`.
- `culinary`.

Đây là view model phục vụ public UI, không nên dùng trực tiếp làm DTO backend.

## 5. Component behavior

### FounderCard

File:

- `src/components/founder-stories/FounderCard.jsx`

Trách nhiệm:

- Hiển thị ảnh Founder.
- Hiển thị badge, category, tên và chức danh.
- Hiển thị metadata dạng grid.
- Chuyển đổi giữa ba tab nội dung.
- Hiển thị quote tương ứng với tab hiện tại.
- Có fallback image nếu object story cung cấp `fallbackImage`.

Style chính:

- Card trắng.
- Border màu beige.
- Bo góc lớn.
- Shadow nhẹ.
- Thanh nhấn gradient wine-gold ở đầu card.
- Layout một cột trên mobile, hai vùng nội dung trên desktop.

### StoryFilter

File:

- `src/components/founder-stories/StoryFilter.jsx`

Trách nhiệm:

- Chọn category.
- Tìm kiếm theo text.
- Hiển thị breadcrumb.
- Hiển thị số lượng kết quả.
- Cho phép kéo ngang danh sách category trên màn hình nhỏ.

Category hiện được import trực tiếp từ mock data.

### FounderStoryList

File:

- `src/components/founder-stories/FounderStoryList.jsx`

Trách nhiệm:

- Render danh sách `FounderCard`.
- Hiển thị empty state khi không có kết quả.
- Cho phép reset filter.

### SubmitStoryModal

Form hiện có các trường phục vụ gửi câu chuyện Founder, nhưng submit mới chỉ mô phỏng trạng thái thành công. Chưa có:

- API request.
- Upload ảnh hoặc hồ sơ.
- Backend validation.
- Error response.
- Chống submit lặp.

Đây nên được xem là workflow submission public, tách khỏi workflow CRUD nội dung đã được duyệt trong Admin.

## 6. Style và design convention

### Font

- Font chủ đạo: Inter.
- `index.html` hiện tải Inter từ Google Fonts.
- Project cũng có asset local `InterVariable.woff2`, nhưng chưa có `@font-face` thống nhất.

### Color tokens hiện tại

```css
--primary-color: #680007;
--secondary-color: #b88628;
--background-light: #faf9f7;
--wine: #680007;
--gold: #b88628;
--line: #e5e5e5;
--muted: #4b5563;
```

Một số component đang dùng thêm các biến thể:

- `#710008` cho wine đậm.
- `#d49520` cho gold nhấn.
- `#faf8f5`, `#f4f1ea`, `#e8dfd3` cho nền và border beige.

Khi xây CMS nên gom các giá trị này thành token dùng chung, tránh tiếp tục hard-code màu trong từng component.

### Layout và responsive

Public layout thường sử dụng:

```text
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

Breakpoint hiện tại:

- Mobile-first.
- Layout Founder chuyển sang dạng nhiều cột từ `lg`.
- Header public chuyển menu desktop từ `xl`.
- Tabs và category list cho phép overflow ngang trên màn hình nhỏ.
- Modal dùng giới hạn chiều cao và scroll nội bộ.

## 7. Admin shell hiện tại

Admin route root:

```text
/admin
```

Founder module:

```text
/admin/stories
```

Module được đăng ký trong:

- `src/config/Admin/adminNavigation.js`

Layout chính:

- `src/layout/Admin/AdminLayout.jsx`
- `src/components/Admin/AdminSidebar.jsx`
- `src/components/Admin/AdminTopbar.jsx`

Admin shell đã có:

- Sidebar desktop.
- Sidebar dạng dialog trên mobile.
- Topbar.
- Light/dark theme.
- CSS variables riêng cho Admin.
- Skip link tới nội dung chính.
- Focus-visible state.
- Đóng mobile sidebar khi chuyển desktop.
- Tự cập nhật document title theo module hiện tại.
- Scroll về đầu khi đổi route.

Hiện `/admin/stories` vẫn là placeholder, chưa có màn hình CRUD Founder.

## 8. API integration hiện tại

Frontend chưa có API client dùng thật:

- `src/api/demo.js` gần như chưa triển khai.
- `src/config/config.js` chưa có API base URL.
- Chưa có convention rõ cho `fetch` hoặc `axios`.
- Chưa có auth token, interceptor, cache hoặc retry layer.

Khi tích hợp Founder API nên tách các lớp:

```text
founderApi.js
  -> founderMapper.js
  -> FounderAdminPage state
  -> form/list components
```

Không nên để từng component tự gọi endpoint hoặc tự biến đổi DTO.

## 9. Mismatch với backend Founder API

Backend Founder API hiện quản lý các nhóm:

- `hero_section`.
- `section`.
- `cta_section`.
- `certificate` bên trong CTA.

Trong khi public mock data frontend dùng:

- `tabs`.
- `meta`.
- `category`.
- `categoryLabel`.
- `badgeText`.

Vì vậy cần có mapper rõ ràng giữa backend DTO và frontend view model.

Các điểm cần quyết định:

1. `section` backend sẽ ánh xạ thành Founder card như thế nào.
2. Nội dung `founder_profile` ánh xạ vào các tab `about`, `journey`, `achievements` ra sao.
3. Category có nằm trong backend contract hay là metadata riêng của frontend.
4. Field `image` là URL trực tiếp, asset id hay Cloudinary key.
5. Có cần thêm alt text, thumbnail và fallback image hay không.
6. Có cần trạng thái `draft`, `published`, `archived` hoặc moderation status hay không.
7. Có cần pagination và server-side filtering hay không.

## 10. Định hướng xây Founder CMS

### Màn hình danh sách

Nên có:

- Tiêu đề trang và breadcrumb Admin.
- Nút tạo Founder.
- Search.
- Filter theo trạng thái hoặc category nếu backend hỗ trợ.
- Bảng hoặc list responsive.
- Preview ảnh.
- Trạng thái nội dung.
- Ngày cập nhật.
- Actions edit, delete hoặc duplicate nếu cần.
- Empty, loading và error state.

### Màn hình chỉnh sửa

Nên chia form thành các nhóm:

1. Hero content.
2. Founder sections.
3. Founder profile.
4. CTA.
5. Certificates.
6. Image/media.

Form dài nên dùng page hoặc panel rõ ràng thay vì modal nhỏ. Modal phù hợp cho xác nhận xóa hoặc thao tác nhanh.

### Nguyên tắc UX

- Control tối thiểu khoảng 44px cho thao tác cảm ứng.
- Có cảnh báo unsaved changes.
- Có feedback rõ sau create/update/delete.
- Không mất dữ liệu khi API lỗi.
- Có retry khi load thất bại.
- Hỗ trợ keyboard và focus state theo Admin shell hiện tại.
- Không dùng public card style làm layout chính của CMS.

## 11. Rủi ro hiện tại

- Public Founder page vẫn phụ thuộc hoàn toàn vào mock data.
- Một số ảnh đang hotlink từ bên ngoài.
- `FounderCard` giả định luôn tồn tại ba tab cố định.
- `SubmitStoryModal` chưa gọi API.
- Admin Founder route chưa có implementation.
- Global style còn trộn CSS token với màu hard-code.
- `main.css` và `index.html` có dấu hiệu cấu hình Tailwind/font dư thừa cần dọn khi ổn định hóa frontend.

## 12. Kết luận

Frontend đã có public Founder experience và Admin shell làm nền, nhưng chưa có Founder CMS thực tế. Public component nên được dùng làm reference cho nội dung và cách trình bày, không nên tái sử dụng trực tiếp làm contract dữ liệu quản trị.

Bước triển khai hợp lý:

1. Chốt contract giữa backend DTO và frontend view model.
2. Tạo API client và mapper Founder.
3. Xây danh sách Founder trong `/admin/stories`.
4. Xây form CRUD theo nhóm nội dung.
5. Bổ sung loading, error, empty, validation và unsaved changes.
6. Thay mock data public bằng adapter API sau khi contract ổn định.
