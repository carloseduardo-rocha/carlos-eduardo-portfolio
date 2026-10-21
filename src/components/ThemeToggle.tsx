import * as m from 'motion/react-m'
import { setTheme, type Theme } from '@/lib/theme'
import { useTheme } from '@/lib/useTheme'

export function ThemeToggle() {
  const theme = useTheme()
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <m.button
      type="button"
      onClick={() => setTheme(next)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={next === 'light' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      className="grid size-9 cursor-pointer place-items-center rounded-full border border-line text-muted md:backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {theme === 'dark' ? (
        // sun → "go light"
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // moon → "go dark"
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </m.button>
  )
}
