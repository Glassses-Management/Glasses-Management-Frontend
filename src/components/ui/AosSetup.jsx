import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AOS from 'aos'

// Global AOS (Animate On Scroll) setup.
// - Initialises AOS once on mount so `data-aos` attributes start animating.
// - Refreshes after every navigation so newly-mounted pages animate too.
function AosSetup() {
  const { pathname } = useLocation()

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic', offset: 60 })
  }, [])

  useEffect(() => {
    AOS.refreshHard()
  }, [pathname])

  return null
}

export default AosSetup