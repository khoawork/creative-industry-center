const paths = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  trophy: 'M8 3h8v7a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-4 2h8m-10 0h12',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  medal: 'm8 3 4 6 4-6M6 3l4 7m8-7-4 7M18 15a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-6-3v6m-2-4h4',
  book: 'M12 6v15m0-15C9 3 5 3 3 4v14c3-1 6 0 9 3 3-3 6-4 9-3V4c-2-1-6-1-9 2Z',
  bulb: 'M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0l-1 2H9l-1-2Z',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z',
  cap: 'm2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 3 8 3 12 0v-6m4-3v9',
  users: 'M16 21v-3a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v3m17 0v-3a4 4 0 0 0-3-4M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3a4 4 0 0 1 0 8',
  mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  phone: 'm7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3-2 4C10 21 3 14 3 5l4-2Z',
  pin: 'M19 9c0 6-7 12-7 12S5 15 5 9a7 7 0 1 1 14 0ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  check: 'm5 12 4 4L19 6',
  calendar: 'M4 5h16v16H4V5Zm3-3v6m10-6v6M4 10h16',
}

export default function Icon({ name = 'arrow', size = 20, className = '' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><path d={paths[name] || paths.arrow} /></svg>
}
