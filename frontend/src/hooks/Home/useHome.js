import { useEffect, useRef, useState } from 'react'

export default function useHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(window.location.hash || '#trang-chu')
  const [dialog, setDialog] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    const onHashChange = () => {
      setActiveSection(window.location.hash || '#trang-chu')
      setMenuOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (dialog && !dialogRef.current.open) dialogRef.current.showModal()
  }, [dialog])

  function openDialog(kind, item = null) {
    setSubmitted(false)
    setDialog({ kind, item })
    setMenuOpen(false)
  }

  function closeDialog() {
    dialogRef.current?.close()
    setDialog(null)
    setSubmitted(false)
  }

  function submitDemo(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return { menuOpen, setMenuOpen, activeSection, dialog, dialogRef, submitted, openDialog, closeDialog, submitDemo }
}
