import { Field, ListFields } from './FormFields.jsx'

export default function HeroEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <ListFields label="Đường dẫn điều hướng" path="breadcrumbs" value={value.breadcrumbs} errors={errors} onChange={(breadcrumbs) => onChange({ ...value, breadcrumbs })} createItem={() => ({ text: '', link: null })}>
      {(raw, update, path) => {
        const item = raw || {}
        return <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nhãn điều hướng" value={item.text} onChange={(text) => update({ ...item, text })} path={`${path}.text`} errors={errors} />
          <Field label="Liên kết điều hướng" required={false} value={item.link} onChange={(link) => update({ ...item, link: link === '' ? null : link })} path={`${path}.link`} errors={errors} hint="Để trống nếu không có liên kết." />
        </div>
      }}
    </ListFields>
    <Field label="Tiêu đề" path="title_main" value={value.title_main} errors={errors} onChange={(title_main) => onChange({ ...value, title_main })} />
    <Field label="Trích dẫn" multiline path="quote" value={value.quote} errors={errors} onChange={(quote) => onChange({ ...value, quote })} />
    <Field label="Tác giả (tùy chọn)" required={false} path="quote_author" value={value.quote_author} errors={errors} onChange={(quote_author) => onChange({ ...value, quote_author })} />
  </div>
}
