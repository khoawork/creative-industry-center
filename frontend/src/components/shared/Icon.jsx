import { iconPaths } from '../../config/shared/iconPaths.js'

export default function Icon({ name = 'arrow', size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" className={className}>
      <path d={iconPaths[name] || iconPaths.arrow} />
    </svg>
  )
}
