import { useEffect, useState } from 'react'

// Dev-only red strip at the bottom of the screen that shows any uncaught
// error / unhandled rejection instead of leaving a silent blank page.
function ErrorOverlay() {
  const [error, setError] = useState('')

  useEffect(() => {
    window.__errorReport = (message) =>
      setError((prev) => (prev ? `${prev}\n\n${message}` : String(message)))

    const onError = (e) =>
      window.__errorReport(e.error?.stack || e.error?.message || e.message)
    const onRejection = (e) =>
      window.__errorReport(e.reason?.stack || e.reason?.message || e.reason)

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.__errorReport = null
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  if (!error) return null
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: '#7f1d1d',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        padding: '10px 14px',
        maxHeight: '40vh',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      }}
    >
      {error}
    </div>
  )
}

export default ErrorOverlay