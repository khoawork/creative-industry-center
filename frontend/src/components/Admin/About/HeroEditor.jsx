import { Field } from './FormFields.jsx'

export default function HeroEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <Field label="Tiêu đề" path="title_main" value={value.title_main} errors={errors} onChange={(title_main) => onChange({ ...value, title_main })} />
    <Field label="Trích dẫn" multiline path="quote" value={value.quote} errors={errors} onChange={(quote) => onChange({ ...value, quote })} />
    <Field label="Tác giả (tùy chọn)" required={false} path="quote_author" value={value.quote_author} errors={errors} onChange={(quote_author) => onChange({ ...value, quote_author })} />
  </div>
}
