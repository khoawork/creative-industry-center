import { iconPaths } from '../../config/shared/iconPaths.js'
import DynamicIcon from '../icons/DynamicIcon.jsx'

export default function Icon({ name = 'arrow', size = 20, className = '' }) {
  if (name && iconPaths[name]) {
    return (
      <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" className={className}>
        <path d={iconPaths[name]} />
      </svg>
    )
  }
  return <DynamicIcon name={name || 'arrow'} size={size} className={className} />
}

