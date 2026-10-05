import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import Field from './EventField.jsx'
import EventStatusMultiSelect from './EventStatusMultiSelect.jsx'
import { adminButton } from '../../../config/Admin/adminEvents.js'

export default function PageSectionFields({ section, value, onChange }) {
  const update = (key, next) => onChange({ ...value, [key]: next })
  const labels = section === 'hero_section'
    ? { badge: 'Nhãn đầu trang', title: 'Tiêu đề', description: 'Mô tả' }
    : section === 'filter_section'
      ? {}
      : { tag: 'Nhãn bản tin', title: 'Tiêu đề', description: 'Mô tả', privacy_text: 'Thông tin bảo mật' }
  const statistics = value.statistics || []
  const breadcrumbs = value.breadcrumbs || []
  const statusFilters = (value.status_filters || []).map((filter) => ({
    ...filter,
    statuses: Array.isArray(filter.statuses) ? filter.statuses : filter.status ? [filter.status] : [],
  }))
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
    {section === 'newsletter_section' && <fieldset className="space-y-5 border-t border-(--admin-border) pt-5">
      <legend className="pr-3 font-semibold">Biểu mẫu đăng ký</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nhãn ô họ và tên" required value={value.full_name_label || ''} onChange={(next) => update('full_name_label', next)} />
        <Field label="Gợi ý ô họ và tên" required value={value.full_name_placeholder || ''} onChange={(next) => update('full_name_placeholder', next)} />
        <Field label="Nhãn ô đơn vị / doanh nghiệp" required value={value.organization_label || ''} onChange={(next) => update('organization_label', next)} />
        <Field label="Gợi ý ô đơn vị / doanh nghiệp" required value={value.organization_placeholder || ''} onChange={(next) => update('organization_placeholder', next)} />
        <Field label="Nhãn ô email" required value={value.email_label || ''} onChange={(next) => update('email_label', next)} />
        <Field label="Gợi ý ô email" required value={value.email_placeholder || ''} onChange={(next) => update('email_placeholder', next)} />
      </div>
      <Field label="Nội dung đồng ý nhận thông tin" required multiline value={value.consent_text || ''} onChange={(next) => update('consent_text', next)} />
      <Field label="Nhãn nút đăng ký" required value={value.button_text || ''} onChange={(next) => update('button_text', next)} />
      <Field label="Thông báo đăng ký thành công" required multiline value={value.success_message || ''} onChange={(next) => update('success_message', next)} />
    </fieldset>}
  </div>
}
