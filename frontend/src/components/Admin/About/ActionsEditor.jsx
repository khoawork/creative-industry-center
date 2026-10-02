import { Field, IconField, ListFields } from './FormFields.jsx'

export default function ActionsEditor({ value, onChange, errors }) {
  return <ListFields label="Nút hành động" path="buttons" value={value.buttons} onChange={(buttons) => onChange({ ...value, buttons })} errors={errors} createItem={() => ({ text: '', link: '', icon: '' })}>
    {(raw, update, path) => {
      const item = raw || {}
      return <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nhãn nút" value={item.text} onChange={(text) => update({ ...item, text })} path={`${path}.text`} errors={errors} />
        <Field label="Liên kết nút" value={item.link} onChange={(link) => update({ ...item, link })} path={`${path}.link`} errors={errors} hint="Đường dẫn /... hoặc URL http/https." />
        <IconField value={item.icon} onChange={(icon) => update({ ...item, icon })} path={`${path}.icon`} errors={errors} />
      </div>
    }}
  </ListFields>
}
