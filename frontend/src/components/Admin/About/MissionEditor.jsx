import { FeaturedImageFields, HeadingFields, ItemListFields } from './FormFields.jsx'

export default function MissionEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <HeadingFields value={value} onChange={onChange} errors={errors} />
    <FeaturedImageFields value={value.featured_image} onChange={(featured_image) => onChange({ ...value, featured_image })} errors={errors} />
    <ItemListFields value={value.items} onChange={(items) => onChange({ ...value, items })} errors={errors} />
  </div>
}
