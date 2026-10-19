import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useTheme } from '@/lib/useTheme'

/** Every game draws on a 400×400 logical canvas that CSS scales to fit. */
export const SIZE = 400

export type Palette = {
  bg: string
  fg: string
  muted: string
  line: string
  accent: string
  accent2: string
}

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement)
  const g = (name: string) => cs.getPropertyValue(name).trim()
  return {
    bg: g('--color-bg'),
    fg: g('--color-fg'),
    muted: g('--color-muted'),
    line: g('--color-line'),
    accent: g('--color-accent'),
    accent2: g('--color-accent-2'),
  }
}

/** Live theme colors for canvas drawing (refreshed whenever the theme flips). */
export function usePalette(): RefObject<Palette> {
  const theme = useTheme()
  const ref = useRef<Palette>({ bg: '#04070d', fg: '#e9f2ff', muted: '#8fa3bf', line: '#33415a', accent: '#22e6ff', accent2: '#7a6bff' })
  useEffect(() => {
    ref.current = readPalette()
  }, [theme])
  return ref
}

/** Sets the backing store for the device pixel ratio and returns a 400×400 context. */
export function prepareCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = SIZE * dpr
  canvas.height = SIZE * dpr
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

/**
 * requestAnimationFrame loop that only runs while `target` is on screen and the tab is visible.
 * `cb` receives the elapsed seconds (capped so a stalled tab does not teleport things).
 */
export function useLoop(cb: (dt: number) => void, target: RefObject<Element | null>) {
  const latest = useRef(cb)
  useEffect(() => {
    latest.current = cb
  })

  useEffect(() => {
    const el = target.current
    if (!el) return
    let raf = 0
    let last = 0
    let visible = false
    const frame = (t: number) => {
      latest.current(Math.min((t - last) / 1000, 0.05))
      last = t
      raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const shouldRun = visible && !document.hidden
      if (shouldRun && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      cancelAnimationFrame(raf)
    }
  }, [target])
}

/** Best score kept in localStorage (guarded: it can throw in private windows). */
export function useBest(key: string): [number, (n: number) => void] {
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(key)) || 0
    } catch {
      return 0
    }
  })
  const save = useCallback(
    (n: number) => {
      setBest((b) => {
        if (n <= b) return b
        try {
          localStorage.setItem(key, String(n))
        } catch {
          /* storage unavailable: the best only lives for this visit */
        }
        return n
      })
    },
    [key],
  )
  return [best, save]
}

/** Dim the playfield and write a title + hint in the middle. */
export function overlay(ctx: CanvasRenderingContext2D, pal: Palette, title: string, hint: string, dy = 0) {
  ctx.save()
  ctx.globalAlpha = 0.74
  ctx.fillStyle = pal.bg
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.restore()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = pal.fg
  ctx.font = '700 24px "Space Grotesk Variable", "Inter Variable", sans-serif'
  ctx.fillText(title, SIZE / 2, SIZE / 2 - 6 + dy)
  ctx.fillStyle = pal.accent
  ctx.font = '500 13px "Inter Variable", sans-serif'
  ctx.fillText(hint, SIZE / 2, SIZE / 2 + 20 + dy)
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="font-display text-2xl font-bold tabular-nums text-accent">{value}</p>
    </div>
  )
}

export function GameButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/60 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  )
}

export const canvasClass =
  'block aspect-square w-full max-w-[420px] touch-none rounded-2xl border border-line bg-bg/70 shadow-[0_0_60px_-24px_var(--color-accent)]'
