import { useEffect } from 'react'
import type { RefObject } from 'react'
import { portal, syncPortal } from '@/lib/portal'

/** How much deliberate "keep scrolling" the visitor must do at the very end to restart. */
const LOOP_THRESHOLD = 360

/**
 * Scroll choreography:
 *  1. #intro  – pinned stage; scrolling opens the logo into the hero.
 *  2. content – normal scroll.
 *  3. #outro  – pinned stage; scrolling closes everything back into the logo.
 *  4. at the very bottom, extra wheel/touch intent restarts at the top. The last
 *     frame of the outro is the same logo as the first frame of the intro, so the
 *     jump is invisible (a short fade covers the text swap).
 * Native scroll is never hijacked, so keyboard, scrollbar and iOS momentum keep working.
 *
 * GSAP is imported dynamically so it stays out of the first-paint bundle.
 */
export function usePortalScroll(root: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    if (portal.reduced) return
    const el = root.current
    if (!el) return

    let disposed = false
    let teardown = () => {}

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { Observer }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/Observer'),
      ])
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger, Observer)
      ScrollTrigger.config({ ignoreMobileResize: true })

      const heroActions = el.querySelector<HTMLElement>('[data-hero-actions]')
      const outroActions = el.querySelector<HTMLElement>('[data-outro-actions]')
      heroActions?.setAttribute('inert', '')
      outroActions?.setAttribute('inert', '')

      const applyIntro = (p: number) => {
        portal.intro = p
        syncPortal()
        heroActions?.toggleAttribute('inert', p < 0.8)
      }
      const applyOutro = (p: number) => {
        portal.outro = p
        syncPortal()
        outroActions?.toggleAttribute('inert', p < 0.75)
      }

      const loop = { v: 0 }
      let looping = false
      let lastEvent = 0
      let observer: ReturnType<typeof Observer.create> | undefined

      const ctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#intro',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              onRefresh: (s) => applyIntro(s.progress),
              onUpdate: (s) => applyIntro(s.progress),
            },
          })
          .to('.cue', { autoAlpha: 0, y: 14, duration: 0.1 }, 0)
          .fromTo(
            '.hero-reveal',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.2, stagger: 0.06, ease: 'power2.out' },
            0.46,
          )
          .to('.skip', { autoAlpha: 0, duration: 0.08 }, 0.9)
          .set({}, {}, 1)

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#outro',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              onRefresh: (s) => applyOutro(s.progress),
              onUpdate: (s) => applyOutro(s.progress),
            },
          })
          .fromTo(
            '.outro-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.08, ease: 'power2.out' },
            0.5,
          )
          .set({}, {}, 1)

        // --- loop: deliberate extra scroll at the bottom restarts the experience ---
        const paint = () => el.style.setProperty('--loop', loop.v.toFixed(3))
        const atBottom = () =>
          window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 6

        const restart = () => {
          looping = true
          gsap.killTweensOf(loop)
          gsap
            .timeline({ onComplete: () => void (looping = false) })
            .to('#veil', { opacity: 1, duration: 0.25, ease: 'power2.in' })
            .add(() => {
              loop.v = 0
              paint()
              window.scrollTo(0, 0)
              ScrollTrigger.update()
            })
            .to('#veil', { opacity: 0, duration: 0.45, ease: 'power2.out' })
        }

        const fadeLoop = (delay: number) =>
          gsap.to(loop, { v: 0, duration: 0.5, delay, ease: 'power1.out', onUpdate: paint })

        observer = Observer.create({
          target: window,
          type: 'wheel,touch',
          tolerance: 6,
          preventDefault: false,
          onDown: (self) => {
            if (looping || !atBottom()) return
            const now = performance.now()
            if (now - lastEvent > 800) loop.v = 0
            lastEvent = now
            loop.v = Math.min(1, loop.v + Math.min(Math.abs(self.deltaY), 120) / LOOP_THRESHOLD)
            paint()
            gsap.killTweensOf(loop)
            if (loop.v >= 1) restart()
            else fadeLoop(0.7)
          },
          onUp: () => {
            if (looping || loop.v === 0) return
            gsap.killTweensOf(loop)
            fadeLoop(0)
          },
        })
      }, el)

      // WebGL failed → behave like a normal page (CSS flattens the layout)
      const flatten = () => {
        observer?.kill()
        ctx.revert()
        ScrollTrigger.getAll().forEach((t) => t.kill())
        heroActions?.removeAttribute('inert')
        outroActions?.removeAttribute('inert')
      }
      addEventListener('portal:flat', flatten)
      if (document.documentElement.dataset.gl === 'off') flatten()

      teardown = () => {
        removeEventListener('portal:flat', flatten)
        observer?.kill()
        ctx.revert()
      }
    })()

    return () => {
      disposed = true
      teardown()
    }
  }, [root])
}
