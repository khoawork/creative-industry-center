import { iconPaths } from '../shared/iconPaths.js'

// Shared by the public page and admin; update here if the database Page ID changes.
export const INTRODUCE_PAGE_ID = 2

export const aboutIconNames = {
  globe: 'globe',
  lightbulb: 'bulb',
  badge_check: 'check',
  award: 'medal',
  building: 'landmark',
  graduation_cap: 'cap',
  trophy: 'trophy',
  badge: 'premium',
  handshake: 'handshake',
  leaf: 'leaf',
  calendar: 'calendar',
}

export function getAboutIconName(code) {
  if (typeof code !== 'string' || !Object.hasOwn(aboutIconNames, code)) return null

  const name = aboutIconNames[code]
  return Object.hasOwn(iconPaths, name) ? name : null
}
