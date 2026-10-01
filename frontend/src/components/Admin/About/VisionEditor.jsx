import { FeaturedImageFields, HeadingFields, ItemListFields, ParagraphFields } from './FormFields.jsx'

export default function VisionEditor({ value, onChange, errors }) {
  return <div className="space-y-6">
    <HeadingFields value={value} onChange={onChange} errors={errors} />
    <ParagraphFields value={value.paragraphs} onChange={(paragraphs) => onChange({ ...value, paragraphs })} errors={errors} />
    <FeaturedImageFields value={value.featured_image} onChange={(featured_image) => onChange({ ...value, featured_image })} errors={errors} />
    <ItemListFields value={value.items} onChange={(items) => onChange({ ...value, items })} errors={errors} />
  </div>
}
