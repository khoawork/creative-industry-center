import { Field, HeadingFields, ItemListFields } from './FormFields.jsx'

export default function CoreValuesEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <HeadingFields value={value} onChange={onChange} errors={errors} />
    <Field label="Mô tả chung" multiline path="description" value={value.description} errors={errors} onChange={(description) => onChange({ ...value, description })} />
    <ItemListFields value={value.items} onChange={(items) => onChange({ ...value, items })} errors={errors} />
  </div>
}
