// Search input that types instantly but only tells the parent after ~300ms of
// silence, so list filtering doesn't run on every keystroke.

import { useEffect, useRef, useState } from 'react'

function SearchBar({ value, onChange, placeholder = 'Search by name, phone, or email...' }) {
  const [input, setInput] = useState(value ?? '')
  const [syncedFrom, setSyncedFrom] = useState(value ?? '')

  // The newest value/onChange live in a ref rather than in the debounce's
  // dependency array. Parents usually pass a fresh onChange closure on every
  // render, and depending on it would reset the timer so often that onChange
  // would never actually fire.
  const latest = useRef({ value, onChange })
  useEffect(() => {
    latest.current = { value, onChange }
  }, [value, onChange])

  // Adjust state during render (React's recommended alternative to a
  // setState-in-effect) when the parent pushes a new value from outside, e.g.
  // a "clear filters" button.
  if ((value ?? '') !== syncedFrom) {
    setSyncedFrom(value ?? '')
    setInput(value ?? '')
  }

  useEffect(() => {
    const snapshot = input
    const timeout = setTimeout(() => {
      if (snapshot !== (latest.current.value ?? '')) latest.current.onChange(snapshot)
    }, 300)
    return () => clearTimeout(timeout)
  }, [input])

  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:bg-surface-dark dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-forest-400"
      />
    </div>
  )
}

export default SearchBar