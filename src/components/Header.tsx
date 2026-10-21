import * as m from 'motion/react-m'
import { ThemeToggle } from '@/components/ThemeToggle'

function skipIntro() {
  const intro = document.getElementById('intro')
  if (!intro) return
  window.scrollTo({ top: intro.offsetHeight - window.innerHeight, behavior: 'auto' })
}

/** Fixed top bar: brand, "skip intro" (only while the intro is closed) and the theme toggle. */
export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="header-fade absolute inset-x-0 top-0 h-20" aria-hidden="true" />
      <div className="relative flex items-center justify-between px-6 py-4 md:px-10">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          CR · CaduDev
        </span>
        <div className="pointer-events-auto flex items-center gap-3">
          <m.button
            type="button"
            onClick={skipIntro}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="skip cursor-pointer rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted md:backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Pular intro
          </m.button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
