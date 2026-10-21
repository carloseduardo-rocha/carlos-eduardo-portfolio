import { useEffect, useState, type ReactNode } from 'react'

/**
 * Mounts its children one at a time, each in its own idle slot, instead of all in the first render.
 * The hero (the only thing on screen at load) paints sooner and the main thread never gets one big task,
 * which matters most on phones. Everything is mounted at once on the first scroll/touch/key, or right away
 * when the URL has a #hash (the browser needs the target to exist).
 */
export function Staged({ children }: { children: ReactNode[] }) {
  const total = children.length
  const [count, setCount] = useState(() => (location.hash ? total : 0))

  useEffect(() => {
    if (count >= total) {
      // the page just got taller: let ScrollTrigger re-measure the outro
      const id = requestAnimationFrame(() => dispatchEvent(new Event('resize')))
      return () => cancelAnimationFrame(id)
    }

    const all = () => setCount(total)
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown', 'scroll'] as const
    events.forEach((e) => addEventListener(e, all, { once: true, passive: true }))

    const next = () => setCount((c) => c + 1)
    const id = window.requestIdleCallback ? window.requestIdleCallback(next, { timeout: 600 }) : window.setTimeout(next, 120)

    return () => {
      events.forEach((e) => removeEventListener(e, all))
      if (window.cancelIdleCallback) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [count, total])

  return <>{children.slice(0, count)}</>
}
