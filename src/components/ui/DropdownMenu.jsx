import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal } from 'lucide-react'

// Small "..." menu for row actions, so a table row does not need a button for
// every possible action. Closes when you click outside it or press Escape.
//
// The menu is rendered into document.body with fixed positioning. DataTable
// wraps rows in an overflow-hidden container, which would otherwise clip a menu
// positioned inside a cell no matter how high its z-index is.
//
// items: [{ label, onSelect, icon, danger }]
const MENU_WIDTH = 176
const MENU_GAP = 4
const EDGE = 8

export default function DropdownMenu({ items = [], label = 'More actions' }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  // Anchor the menu to the button. Flips above the button when there is not
  // enough room below, and keeps it inside the window horizontally.
  const place = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const fitsBelow = window.innerHeight - rect.bottom > 120

    setPosition({
      top: fitsBelow ? rect.bottom + MENU_GAP : undefined,
      bottom: fitsBelow ? undefined : window.innerHeight - rect.top + MENU_GAP,
      left: Math.max(EDGE, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - EDGE)),
    })
  }, [])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event) => {
      const inTrigger = triggerRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inTrigger && !inMenu) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    place()
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', place)
    // capture catches scrolls in any inner container, not just the window
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  if (items.length === 0) return null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && position && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: position.top, bottom: position.bottom, left: position.left, width: MENU_WIDTH }}
          className="z-50 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-[#1c1c28]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect?.()
              }}
              className={
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-300 ' +
                (item.danger
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-white/5')
              }
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}
