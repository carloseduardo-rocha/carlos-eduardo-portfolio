import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useRef } from 'react'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Education } from '@/components/Education'
import { Engrenagem } from '@/components/Engrenagem'
import { Games } from '@/components/Games'
import { GestaoCheck } from '@/components/GestaoCheck'
import { Header } from '@/components/Header'
import { Intro } from '@/components/Intro'
import { Outro } from '@/components/Outro'
import { ParticleStage } from '@/components/ParticleStage'
import { Projects } from '@/components/Projects'
import { usePortalScroll } from '@/hooks/usePortalScroll'

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  usePortalScroll(root)

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div ref={root}>
          <ParticleStage />
          <Header />
          <main className="relative z-10">
            <Intro />
            <About />
            <GestaoCheck />
            <Engrenagem />
            <Projects />
            <Education />
            <Games />
            <Contact />
            <Outro />
          </main>
          {/* brief fade used to hide the jump back to the top when the loop restarts */}
          <div
            id="veil"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60] bg-bg opacity-0"
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
