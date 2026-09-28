import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { siteLinks } from '../../config/shared/site.js'

export default function useHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = location.pathname === '/' ? siteLinks.home.href : location.pathname

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (location.hash) navigate(location.pathname + location.search, { replace: true })
  }, [location.hash, location.pathname, location.search, navigate])

  function selectSection(event, href) {
    event.preventDefault()
    navigate(href)
    if (href === siteLinks.home.href) window.scrollTo({ top: 0, behavior: 'auto' })
    setMenuOpen(false)
  }

  function skipToContent(event) {
    event.preventDefault()
    const target = document.getElementById('noi-dung')
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ block: 'start' })
  }

  return { menuOpen, setMenuOpen, activeSection, selectSection, skipToContent }
}
