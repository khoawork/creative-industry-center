import { Field, FeaturedImageFields, HeadingFields, IconField, ListFields, ParagraphFields } from './FormFields.jsx'

export default function OverviewEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <HeadingFields value={value} onChange={onChange} errors={errors} />
    <ParagraphFields value={value.paragraphs} onChange={(paragraphs) => onChange({ ...value, paragraphs })} errors={errors} />
    <FeaturedImageFields value={value.featured_image} onChange={(featured_image) => onChange({ ...value, featured_image })} errors={errors} />
    <ListFields label="Thống kê" path="statistics" value={value.statistics} onChange={(statistics) => onChange({ ...value, statistics })} errors={errors} min={0} createItem={() => ({ value: '', label: '', icon: '' })}>
      {(raw, update, path) => {
        const item = raw || {}
        return <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Giá trị" value={item.value} onChange={(value) => update({ ...item, value })} path={`${path}.value`} errors={errors} />
          <Field label="Nhãn thống kê" value={item.label} onChange={(label) => update({ ...item, label })} path={`${path}.label`} errors={errors} />
          <IconField value={item.icon} onChange={(icon) => update({ ...item, icon })} path={`${path}.icon`} errors={errors} />
        </div>
      }}
    </ListFields>
  </div>
}
