import Icon from '../shared/Icon.jsx'
import { recordHolderIconPaths, sharedIcons } from '../../config/RecordHolder/recordHolderIcons.js'

export default function RecordHolderIcon({ name, size = 24, filled = false, className = '' }) {
  const key = filled ? `${name}_filled` : name
  const classes = `inline-block shrink-0 align-middle ${className}`.trim()

  if (sharedIcons[key]) {
    return <Icon name={sharedIcons[key]} size={size} className={classes} />
  }

  return (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" className={classes}>
      <path d={recordHolderIconPaths[key]} />
    </svg>
  )
}
