import { useEffect, useRef } from 'react'

/**
 * Fixed full-screen WebGL canvas. Three.js lives in its own chunk and is only
 * requested after the page has painted and the browser is idle, so the first
 * paint is just HTML + CSS.
 */
export function ParticleStage() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let disposed = false
    let cleanup = () => {}
    let idle = 0

    const load = () => {
      void import('@/lib/particles').then(async ({ createParticleScene }) => {
        if (disposed) return
        const dispose = await createParticleScene(canvas, () => disposed)
        if (disposed) dispose()
        else cleanup = dispose
      })
    }
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(load, { timeout: 1500 })
        : window.setTimeout(load, 250)
    }

    if (document.readyState === 'complete') schedule()
    else addEventListener('load', schedule, { once: true })

    return () => {
      disposed = true
      removeEventListener('load', schedule)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      cleanup()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
