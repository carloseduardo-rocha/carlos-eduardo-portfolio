import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Animated stat. The DOM always holds the real value (no JS, crawlers, print and reduced
 * motion all see it). The count-up starts only when the element is about to enter the
 * viewport — it rewinds to 0 a little BEFORE it becomes visible, counts up while the
 * visitor scrolls, and always finishes on the real value.
 */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  // positive bottom margin = fires while the element is still just below the fold
  const near = useInView(ref, { once: true, margin: '0px 0px 18% 0px' })
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (!near || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setValue(0)
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
      onComplete: () => setValue(to),
    })
    return () => {
      controls.stop()
      setValue(to)
    }
  }, [near, to])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}
