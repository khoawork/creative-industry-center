import { useEffect } from 'react'
import { ArrowDown, ArrowUp, Eye, Plus, Send, Sliders, Trash2 } from 'lucide-react'
import Field from './EventField.jsx'
import EventStatusMultiSelect from './EventStatusMultiSelect.jsx'
import { FormBuilder } from '../Base/index.js'
import EventNewsletter from '../../event-actis/EventNewsletter.jsx'
import { adminButton } from '../../../config/Admin/adminEvents.js'
import { fetchFormConfig, DEFAULT_FORM_CONFIGS } from '../../../services/googleSheetService.js'

export default function PageSectionFields({ section, value, onChange }) {
  const update = (key, next) => onChange({ ...value, [key]: next })

  // Tự động tải cấu hình form hiện tại của event_newsletter nếu form_fields đang trống
  useEffect(() => {
    if (section !== 'newsletter_section') return
    const currentFields = Array.isArray(value?.form_fields) ? value.form_fields : []
    if (currentFields.length === 0) {
      fetchFormConfig('event_newsletter').then((cfg) => {
        const activeCfg = cfg || DEFAULT_FORM_CONFIGS.event_newsletter
        const existingFields = activeCfg?.fields || []
        if (existingFields.length > 0) {
          update('form_fields', existingFields.map((f) => ({
            id: f.id || f.key,
            key: f.key || f.id,
            label: f.label || '',
            type: f.type || 'text',
            placeholder: f.placeholder || '',
            required: Boolean(f.required),
            width: f.width || (f.colSpan === 1 ? 'half' : 'full'),
            options: Array.isArray(f.options) ? f.options : [],
            helpText: f.helpText || '',
          })))
        }
      })
    }
  }, [section])

  const labels = section === 'hero_section'
    ? { badge: 'Nhãn đầu trang', title: 'Tiêu đề', description: 'Mô tả' }
    : section === 'filter_section'
      ? {}
      : {}
  const statistics = value.statistics || []
  const breadcrumbs = value.breadcrumbs || []
  const statusFilters = (value.status_filters || []).map((filter) => ({
    ...filter,
    statuses: Array.isArray(filter.statuses) ? filter.statuses : filter.status ? [filter.status] : [],
  }))
  const newsletterFields = Array.isArray(value.form_fields) ? value.form_fields : []
  const move = (index, direction) => {
    const next = [...statistics]
    ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
    update('statistics', next)
  }
  return <div className="space-y-5">
    {section === 'hero_section' && <fieldset className="space-y-4 border-b border-(--admin-border) pb-5">
      <legend className="mb-3 font-semibold">Đường dẫn điều hướng</legend>
      {breadcrumbs.map((item, index) => <div key={index} className="space-y-3 rounded-lg border border-(--admin-border) p-4">
        <div className="flex items-center justify-between gap-2"><span>Mục {index + 1}</span><button type="button" className={adminButton} aria-label={`Xóa điều hướng ${index + 1}`} onClick={() => update('breadcrumbs', breadcrumbs.filter((_, i) => i !== index))}><Trash2 size={14} /></button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tên mục điều hướng" required value={item.text} onChange={(text) => update('breadcrumbs', breadcrumbs.map((old, i) => i === index ? { ...old, text } : old))} />
          <Field label="Liên kết điều hướng" value={item.link || ''} placeholder="Để trống cho trang hiện tại" onChange={(link) => update('breadcrumbs', breadcrumbs.map((old, i) => i === index ? { ...old, link: link || null } : old))} />
        </div>
      </div>)}
      <button type="button" className={adminButton} disabled={breadcrumbs.length >= 8} onClick={() => update('breadcrumbs', [...breadcrumbs, { text: '', link: null }])}><Plus size={16} />Thêm mục điều hướng</button>
    </fieldset>}
    {Object.entries(labels).map(([key, label]) => <Field key={key} label={label} required multiline={key === 'description'} value={value[key] || ''} onChange={(next) => update(key, next)} />)}
    {section === 'filter_section' && <fieldset className="space-y-4 border-t border-(--admin-border) pt-4">
      <legend className="pr-3 font-semibold">Bộ lọc trạng thái</legend>
      {statusFilters.length === 0 && <p className="text-sm text-(--admin-ink)/70">Chưa có bộ lọc trạng thái.</p>}
      {statusFilters.map((filter, index) => {
        return <div key={index} className="grid min-w-0 gap-3 rounded-lg border border-(--admin-border) p-4 sm:grid-cols-[minmax(0,1fr)_minmax(20rem,1fr)_auto] sm:items-end">
          <Field label={`Tên bộ lọc ${index + 1}`} required value={filter.label} onChange={(label) => update('status_filters', statusFilters.map((item, i) => i === index ? { ...item, label } : item))} />
          <EventStatusMultiSelect label="Các trạng thái được lọc" value={filter.statuses} onChange={(statuses) => update('status_filters', statusFilters.map((item, i) => i === index ? { ...item, statuses } : item))} />
          <button type="button" className={adminButton} aria-label={`Xóa bộ lọc ${index + 1}`} onClick={() => update('status_filters', statusFilters.filter((_, i) => i !== index))}><Trash2 size={15} />Xóa</button>
        </div>
      })}
      <button type="button" className={adminButton} disabled={statusFilters.length >= 8} onClick={() => update('status_filters', [...statusFilters, { statuses: ['UPCOMING'], label: 'Sắp diễn ra' }])}><Plus size={16} />Thêm bộ lọc</button>
    </fieldset>}
    {section === 'filter_section' && <Field label="Gợi ý tìm kiếm" required value={value.search_placeholder || ''} onChange={(next) => update('search_placeholder', next)} />}
    {section === 'filter_section' && <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-(--admin-border) p-4 text-sm font-medium">
      <input type="checkbox" checked={value.show_year_filter !== false} onChange={(event) => update('show_year_filter', event.target.checked)} className="size-4 shrink-0 cursor-pointer accent-(--admin-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent)" />
      <span>Hiển thị bộ lọc năm</span>
    </label>}
    {section === 'hero_section' && <fieldset className="space-y-4 border-t border-(--admin-border) pt-4">
      <legend className="pr-3 font-semibold">Thống kê đầu trang</legend>
      {statistics.map((stat, index) => <div key={index} className="space-y-3 rounded-lg border border-(--admin-border) p-4">
        <div className="flex items-center justify-between gap-2"><span>Thống kê {index + 1}</span><div className="flex gap-1">
          <button type="button" className={adminButton} aria-label={`Chuyển thống kê ${index + 1} lên`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={14} /></button>
          <button type="button" className={adminButton} aria-label={`Chuyển thống kê ${index + 1} xuống`} disabled={index === statistics.length - 1} onClick={() => move(index, 1)}><ArrowDown size={14} /></button>
          <button type="button" className={adminButton} aria-label={`Xóa thống kê ${index + 1}`} onClick={() => update('statistics', statistics.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
        </div></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Biểu tượng" value={stat.icon} onChange={(icon) => update('statistics', statistics.map((item, i) => i === index ? { ...item, icon } : item))}>
            <option value="calendar">Lịch</option><option value="users">Đại biểu</option><option value="certificate">Chứng nhận</option><option value="building">Tổ chức</option>
          </Field>
          {['value', 'label'].map((key) => <Field key={key} label={key === 'value' ? 'Giá trị' : 'Nhãn thống kê'} required value={stat[key]} onChange={(next) => update('statistics', statistics.map((item, i) => i === index ? { ...item, [key]: next } : item))} />)}
        </div>
      </div>)}
      <button type="button" className={adminButton} disabled={statistics.length >= 8} onClick={() => update('statistics', [...statistics, { icon: 'calendar', value: '', label: '' }])}><Plus size={16} />Thêm thống kê</button>
    </fieldset>}
    {section === 'newsletter_section' && <>
      <div className="space-y-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center gap-2 border-b border-(--admin-border) pb-3">
          <Send className="text-(--admin-accent)" size={18} />
          <h3 className="text-base font-bold text-(--admin-title)">Phần thông tin</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field compact label="Nhãn CTA" labelClassName="text-(--admin-heading)" required value={value.tag || ''} placeholder="Ví dụ: BẢN TIN VIỆN KỶ LỤC" onChange={(next) => update('tag', next)} />
          <Field compact label="Thông tin bảo mật" labelClassName="text-(--admin-heading)" required value={value.privacy_text || ''} placeholder="Ví dụ: Bảo mật thông tin theo tiêu chuẩn viện nghiên cứu quốc gia." onChange={(next) => update('privacy_text', next)} />
        </div>
      </div>
      <div className="space-y-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <div className="flex items-center gap-2 border-b border-(--admin-border) pb-3">
          <div className="flex items-center gap-2"><Sliders className="text-(--admin-accent)" size={18} /><h3 className="text-base font-bold text-(--admin-title)">Cấu hình Khối Form</h3></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field compact label="Tiêu đề khối Form" labelClassName="text-(--admin-heading)" required value={value.title || ''} placeholder="Ví dụ: Đăng Ký Nhận Thông Báo Sự Kiện Sớm" onChange={(next) => update('title', next)} />
        </div>
        <Field compact label="Mô tả thời gian phản hồi / Ghi chú Form" labelClassName="text-(--admin-heading)" required multiline value={value.description || ''} placeholder="Ví dụ: Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính thức trực tiếp từ Ban Thư ký Trung tâm Công nghiệp Sáng tạo." onChange={(next) => update('description', next)} />
        <fieldset className="space-y-4 border-t border-(--admin-border) pt-4">
          <legend className="pr-3 font-semibold text-(--admin-heading)">Các trường hiển thị trên CTA</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field compact label="Nhãn ô họ và tên" labelClassName="text-(--admin-heading)" required value={value.full_name_label || ''} placeholder="Ví dụ: Họ và tên" onChange={(next) => update('full_name_label', next)} />
            <Field compact label="Gợi ý ô họ và tên" labelClassName="text-(--admin-heading)" required value={value.full_name_placeholder || ''} placeholder="Ví dụ: Nguyễn Văn A" onChange={(next) => update('full_name_placeholder', next)} />
            <Field compact label="Nhãn ô đơn vị / doanh nghiệp" labelClassName="text-(--admin-heading)" required value={value.organization_label || ''} placeholder="Ví dụ: Đơn vị / Doanh nghiệp" onChange={(next) => update('organization_label', next)} />
            <Field compact label="Gợi ý ô đơn vị / doanh nghiệp" labelClassName="text-(--admin-heading)" required value={value.organization_placeholder || ''} placeholder="Ví dụ: Tổ chức / Doanh nghiệp" onChange={(next) => update('organization_placeholder', next)} />
            <Field compact label="Nhãn ô email" labelClassName="text-(--admin-heading)" required value={value.email_label || ''} placeholder="Ví dụ: Địa chỉ Email đại biểu" onChange={(next) => update('email_label', next)} />
            <Field compact label="Gợi ý ô email" labelClassName="text-(--admin-heading)" required value={value.email_placeholder || ''} placeholder="Ví dụ: daibieu@tochuc.vn" onChange={(next) => update('email_placeholder', next)} />
          </div>
          <Field compact label="Nội dung đồng ý nhận thông tin" labelClassName="text-(--admin-heading)" required multiline value={value.consent_text || ''} placeholder="Ví dụ: Tôi đồng ý tiếp nhận các tài liệu và thông tri sự kiện từ VIETKINGS." onChange={(next) => update('consent_text', next)} />
          <Field compact label="Chữ hiển thị trên Nút gửi" labelClassName="text-(--admin-heading)" required value={value.button_text || ''} placeholder="Ví dụ: Xác Nhận Đăng Ký Thông Báo" onChange={(next) => update('button_text', next)} />
          <Field compact label="Thông báo đăng ký thành công" labelClassName="text-(--admin-heading)" required multiline value={value.success_message || ''} placeholder="Ví dụ: Cảm ơn Quý vị! Đăng ký nhận thông tin sự kiện đã được ghi nhận." onChange={(next) => update('success_message', next)} />
        </fieldset>
          <div className="[&_button:not([title])]:text-(--admin-black) [&_button[title]]:text-(--admin-heading) [&_button[title]]:hover:text-(--admin-accent) [&_button[title]]:hover:bg-(--admin-background)"><FormBuilder
          formId="event_newsletter"
          value={{ form_fields: newsletterFields }}
          onChange={(updated) => update('form_fields', Array.isArray(updated.form_fields) ? updated.form_fields : [])}
          showFormMeta={false}
          showPreview={false}
          title="Danh sách Ô Nhập Liệu"
          description=""
          previewAccentColor="#710008"
          /></div>
      </div>
      <div className="rounded-xl border border-(--admin-border) bg-(--admin-surface) p-6 shadow-[var(--admin-panel-shadow)]">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-(--admin-title)"><Eye size={16} className="text-(--admin-accent)" />Xem trước Giao diện Form thực tế</h3>
        <fieldset disabled className="pointer-events-none min-w-0 overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-background)">
          <EventNewsletter section={{ ...value, form_fields: newsletterFields }} />
        </fieldset>
      </div>
    </>}
  </div>
}
