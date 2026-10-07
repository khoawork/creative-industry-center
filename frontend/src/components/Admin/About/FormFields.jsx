import { useId, useState, useRef } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, Upload, Loader2, AlertCircle } from 'lucide-react'
import { aboutIconNames } from '../../../config/About/aboutConfig.js'
import { aboutAdminButton, aboutAdminIconButton } from '../../../config/Admin/adminAbout.js'
import AdminImagePreview from '../Common/AdminImagePreview.jsx'
import { SiteSettingsAPI } from '../../../api/siteSettingsApi.js'

function fieldError(errors, path) {
  const error = errors[path] ?? path.split('.').reduce((value, key) => value?.[key], errors)
  return typeof error === 'string' ? error : Array.isArray(error) ? error.join(' ') : ''
}

export function Field({ label, value, onChange, path, errors = {}, multiline = false, children, hint, required = true, validationMessage = '' }) {
  const id = useId()
  const error = validationMessage || fieldError(errors, path)
  const props = {
    id, name: path, required, value: typeof value === 'string' ? value : '',
    ref: (element) => element?.setCustomValidity(validationMessage),
    onChange: (event) => onChange(event.target.value),
    'aria-invalid': Boolean(error), 'aria-describedby': error || hint ? `${id}-help` : undefined,
    className: 'w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-base leading-6 text-(--admin-ink) outline-none focus:border-(--color-brand-gold) focus-visible:outline-1 focus-visible:outline-(--color-brand-gold) aria-invalid:border-(--admin-heading)',
  }
  return <div className="min-w-0 space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-(--admin-ink)">{label}</label>
    {children ? <select {...props} className={`${props.className} [&>option]:bg-(--admin-surface) [&>option]:text-(--admin-ink)`}>{children}</select> : multiline ? <textarea {...props} rows={3} /> : <input {...props} type="text" />}
    {(error || hint) && <p id={`${id}-help`} className={`text-sm leading-5 ${error ? 'text-(--admin-heading)' : 'text-(--admin-ink)/60'}`}>{error || hint}</p>}
  </div>
}

export function IconField(props) {
  const unknown = typeof props.value === 'string' && props.value && !Object.hasOwn(aboutIconNames, props.value)
  return <Field {...props} required={Boolean(props.required)} label="Biểu tượng" validationMessage={unknown ? 'Vui lòng chọn biểu tượng khác.' : ''}>
    <option value="">{props.required ? 'Chọn biểu tượng' : 'Không dùng biểu tượng'}</option>
    {unknown && <option value={props.value}>{props.value} (chưa hỗ trợ)</option>}
    {Object.keys(aboutIconNames).map((icon) => <option key={icon} value={icon}>{icon}</option>)}
  </Field>
}

export function HeadingFields({ value, onChange, errors }) {
  return <div className="grid gap-5 sm:grid-cols-2">
    <Field label="Nhãn" path="tag" value={value.tag} errors={errors} onChange={(tag) => onChange({ ...value, tag })} />
    <Field label="Tiêu đề" path="title_main" value={value.title_main} errors={errors} onChange={(title_main) => onChange({ ...value, title_main })} />
  </div>
}

export function ListFields({ label, path, value, onChange, errors = {}, min = 1, createItem, children }) {
  const valid = Array.isArray(value)
  const items = valid ? value : []
  const move = (index, offset) => {
    const next = [...items]
    ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
    onChange(next)
  }
  return <fieldset className="min-w-0 space-y-4 border-t border-(--admin-border) pt-4">
    <legend className="pr-3 text-base font-semibold text-(--admin-title)">{label}</legend>
    {fieldError(errors, path) && <p role="alert" className="text-sm text-(--admin-heading)">{fieldError(errors, path)}</p>}
    {!valid && <p className="text-sm text-(--admin-heading)">Danh sách không hợp lệ. Vui lòng nhập lại.</p>}
    {items.map((item, index) => <div key={index} className="space-y-3 border-b border-(--admin-border) pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-(--admin-ink)/70">Mục {index + 1}</span>
        <div className="flex gap-1">
          <button type="button" className={aboutAdminIconButton} title="Chuyển lên" aria-label={`${label}: chuyển mục ${index + 1} lên`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={14} aria-hidden="true" /></button>
          <button type="button" className={aboutAdminIconButton} title="Chuyển xuống" aria-label={`${label}: chuyển mục ${index + 1} xuống`} disabled={index === items.length - 1} onClick={() => move(index, 1)}><ArrowDown size={14} aria-hidden="true" /></button>
          <button type="button" className={aboutAdminIconButton} title="Xóa mục" aria-label={`${label}: xóa mục ${index + 1}`} disabled={items.length <= min} onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 size={14} aria-hidden="true" /></button>
        </div>
      </div>
      {fieldError(errors, `${path}.${index}`) && <p className="text-sm text-(--admin-heading)">{fieldError(errors, `${path}.${index}`)}</p>}
      {children(item, (next) => onChange(items.map((old, i) => i === index ? next : old)), `${path}.${index}`)}
    </div>)}
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={aboutAdminButton} onClick={() => onChange([...items, createItem()])}><Plus size={14} aria-hidden="true" />{valid ? `Thêm ${label.toLowerCase()}` : `Nhập lại ${label.toLowerCase()}`}</button>
      <p className="text-sm text-(--admin-ink)/60">{min ? `Tối thiểu ${min} mục.` : 'Có thể để trống.'}</p>
    </div>
  </fieldset>
}

export function ParagraphFields({ value, onChange, errors }) {
  return <ListFields label="Đoạn văn" path="paragraphs" value={value} onChange={onChange} errors={errors} createItem={() => ''}>
    {(item, update, path) => <Field label="Nội dung đoạn văn" multiline value={item} onChange={update} path={path} errors={errors} />}
  </ListFields>
}

export function FeaturedImageFields({ value, onChange, errors }) {
  const image = value || {}
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')

    // Kiểm tra định dạng (JPG, PNG, WEBP)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Chỉ hỗ trợ file ảnh định dạng JPG, PNG hoặc WEBP.')
      e.target.value = ''
      return
    }

    // Kiểm tra dung lượng (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước ảnh không được vượt quá 5 MB.')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      // Tải ảnh lên máy chủ / Cloudinary
      const res = await SiteSettingsAPI.uploadLogo(file)
      const uploadedUrl = res?.data?.url
      if (!uploadedUrl) {
        throw new Error('Không nhận được đường dẫn ảnh sau khi tải lên.')
      }
      onChange({ ...image, url: uploadedUrl })
    } catch (err) {
      console.error('Lỗi khi tải ảnh lên:', err)
      const msg = err.response?.data?.message || err.message || 'Không thể tải ảnh lên. Vui lòng thử lại.'
      setUploadError(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return <fieldset className="space-y-4 border-t border-(--admin-border) pt-4">
    <legend className="pr-3 text-base font-semibold text-(--admin-title)">Ảnh minh họa</legend>
    {(fieldError(errors, 'featured_image') || uploadError) && (
      <div className="flex items-center gap-1.5 text-sm text-red-500">
        <AlertCircle size={15} className="shrink-0" />
        <span>{uploadError || fieldError(errors, 'featured_image')}</span>
      </div>
    )}
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-4">
        {/* Upload từ máy tính */}
        <div>
          <label className="block text-xs font-semibold text-(--admin-ink) uppercase tracking-wider mb-1.5">
            Tải ảnh từ máy tính
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-(--admin-border) bg-(--admin-surface) px-4 py-2 text-xs font-semibold text-(--admin-ink) shadow-xs transition hover:bg-(--admin-background) active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={15} className="animate-spin text-(--admin-accent)" />
              ) : (
                <Upload size={15} className="text-(--admin-accent)" />
              )}
              <span>{uploading ? 'Đang tải ảnh lên Cloudinary...' : 'Chọn file ảnh từ máy tính'}</span>
            </button>
            {image.url && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange({ ...image, url: '' })}
                className="text-xs text-rose-500 hover:underline cursor-pointer disabled:opacity-50"
              >
                Xóa ảnh hiện tại
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-(--admin-ink)/60">
            Hỗ trợ JPG, PNG, WEBP tối đa 5MB. Ảnh sẽ được tối ưu và lưu trên Cloudinary.
          </p>
        </div>

        {/* URL ảnh */}
        <Field
          label="Hoặc nhập đường dẫn ảnh (URL)"
          path="featured_image.url"
          value={image.url}
          errors={errors}
          onChange={(url) => onChange({ ...image, url })}
          hint="URL http/https hoặc đường dẫn tương đối /..."
        />
        <Field label="Mô tả ảnh (alt)" path="featured_image.alt" value={image.alt} errors={errors} onChange={(alt) => onChange({ ...image, alt })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nhãn trên ảnh (tùy chọn)" required={false} path="featured_image.tag" value={image.tag} errors={errors} onChange={(tag) => onChange({ ...image, tag })} />
          <Field label="Chú thích ảnh" path="featured_image.caption_title" value={image.caption_title} errors={errors} onChange={(caption_title) => onChange({ ...image, caption_title })} />
        </div>
      </div>
      <div className="lg:col-span-5">
        <p className="text-xs font-semibold text-(--admin-ink)/70 mb-2">Xem trước ảnh</p>
        <AdminImagePreview
          src={image.url}
          alt={image.alt || 'Ảnh minh họa'}
          aspectRatio="16:9"
          loading={uploading}
          onRemove={image.url ? () => onChange({ ...image, url: '' }) : null}
        />
      </div>
    </div>
  </fieldset>
}

export function ItemListFields({ value, onChange, errors }) {
  return <ListFields label="Nội dung" path="items" value={value} onChange={onChange} errors={errors} createItem={() => ({ icon: '', title: '', description: '' })}>
    {(raw, update, path) => {
      const item = raw || {}
      return <div className="grid gap-4 sm:grid-cols-2">
        <IconField value={item.icon} onChange={(icon) => update({ ...item, icon })} path={`${path}.icon`} errors={errors} required />
        <Field label="Tiêu đề mục" value={item.title} onChange={(title) => update({ ...item, title })} path={`${path}.title`} errors={errors} />
        <div className="sm:col-span-2"><Field label="Mô tả mục" multiline value={item.description} onChange={(description) => update({ ...item, description })} path={`${path}.description`} errors={errors} /></div>
      </div>
    }}
  </ListFields>
}
