import React from 'react'
import Icon from '../shared/Icon.jsx'
import { DynamicIcon, getIconComponent } from '../icons/index.js'
import { recordHolderIconPaths, sharedIcons } from '../../config/RecordHolder/recordHolderIcons.js'

export default function RecordHolderIcon({ name, size = 24, filled = false, className = '' }) {
  if (!name) return null

  const key = filled ? `${name}_filled` : name
  const classes = `inline-block shrink-0 align-middle ${className}`.trim()

  // 1. Nếu name là Lucide Icon trực tiếp trong hệ thống
  if (getIconComponent(name)) {
    return <DynamicIcon name={name} size={size} className={classes} />
  }

  // 2. Nếu có trong sharedIcons
  if (sharedIcons[key]) {
    return <Icon name={sharedIcons[key]} size={size} className={classes} />
  }

  // 3. Nếu có trong recordHolderIconPaths (SVG của Google Material Symbols)
  if (recordHolderIconPaths[key] || recordHolderIconPaths[name]) {
    const path = recordHolderIconPaths[key] || recordHolderIconPaths[name]
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 -960 960 960"
        fill="currentColor"
        aria-hidden="true"
        className={classes}
      >
        <path d={path} />
      </svg>
    )
  }

  // 4. Fallback an toàn sang DynamicIcon
  return <DynamicIcon name={name} size={size} className={classes} />
}

