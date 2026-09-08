import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hook/UseTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-[#1a1a2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fa88f] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <span
        key={isDark ? 'sun' : 'moon'}
        className="animate-theme-icon text-current"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
    </button>
  )
}

export default ThemeToggle
