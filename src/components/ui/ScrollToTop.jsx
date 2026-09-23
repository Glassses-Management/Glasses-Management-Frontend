import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.querySelectorAll('main.overflow-y-auto').forEach((container) => {
      container.scrollTop = 0
    })
  }, [pathname])

  return null
}

export default ScrollToTop