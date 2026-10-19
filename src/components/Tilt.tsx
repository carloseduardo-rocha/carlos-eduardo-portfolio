import { useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** Tilts its child toward the pointer (3D) with a soft glare. No-op on touch and with reduced motion. */
export function Tilt({ children, max = 7, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const move = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div className={`[perspective:900px] ${className}`}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="tilt relative h-full"
      >
        {children}
        <span aria-hidden="true" className="tilt-glare pointer-events-none absolute inset-0 rounded-2xl" />
      </div>
    </div>
  )
}
