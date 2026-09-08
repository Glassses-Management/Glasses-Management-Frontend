// Search input that types instantly but only tells the parent after ~300ms of
// silence, so list filtering doesn't run on every keystroke.

import { useEffect, useState } from 'react'

function SearchBar({ value, onChange, placeholder = 'Search by name, phone, or email...' }) {
  const [input, setInput] = useState(value ?? '')

  useEffect(() => {
    setInput(value ?? '')
  }, [value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input !== value) onChange(input)
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
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-violet-400"
      />
    </div>
  )
}

export default SearchBar