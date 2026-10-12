import { iconPaths } from '../shared/iconPaths.js'

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
  if (typeof code !== 'string' || !code) return null

  if (Object.hasOwn(aboutIconNames, code)) {
    const name = aboutIconNames[code]
    return Object.hasOwn(iconPaths, name) ? name : code
  }
  return code
}
