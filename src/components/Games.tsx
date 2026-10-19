import { lazy, Suspense, useRef, useState, type KeyboardEvent } from 'react'
import { useInView } from 'motion/react'
import { SectionHeading } from '@/components/SectionHeading'

// The games (canvas code) load only when the section is about to be seen.
const Snake = lazy(() => import('@/components/games/Snake').then((m) => ({ default: m.Snake })))
const TicTacToe = lazy(() => import('@/components/games/TicTacToe').then((m) => ({ default: m.TicTacToe })))
const Pong = lazy(() => import('@/components/games/Pong').then((m) => ({ default: m.Pong })))
const Memory = lazy(() => import('@/components/games/Memory').then((m) => ({ default: m.Memory })))
const Game2048 = lazy(() => import('@/components/games/Game2048').then((m) => ({ default: m.Game2048 })))
const JavaVsAI = lazy(() => import('@/components/games/JavaVsAI').then((m) => ({ default: m.JavaVsAI })))

const games = [
  { id: 'snake', label: 'Snake', hint: 'Coma, cresça e não bata na parede nem em você.', Comp: Snake },
  { id: 'velha', label: 'Jogo da Velha', hint: 'Contra a CPU ou contra um amigo no mesmo aparelho.', Comp: TicTacToe },
  { id: 'pong', label: 'Pong', hint: 'Primeiro a 7 pontos. Arraste o dedo ou use as setas.', Comp: Pong },
  { id: 'java', label: 'Java vs IA', hint: 'A xícara de Java desvia das sentinelas de IA. Hoje tudo virou IA.', Comp: JavaVsAI },
  { id: 'memoria', label: 'Memória Dev', hint: 'Ache os pares de tecnologias no menor número de jogadas.', Comp: Memory },
  { id: '2048', label: '2048', hint: 'Junte números iguais até chegar no 2048.', Comp: Game2048 },
] as const

export function Games() {
  const hostRef = useRef<HTMLDivElement>(null)
  const near = useInView(hostRef, { once: true, margin: '500px 0px 500px 0px' })
  const [index, setIndex] = useState(0)
  const game = games[index]

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : games.length - 1)) % games.length
    setIndex(next)
    document.getElementById(`game-tab-${games[next].id}`)?.focus()
  }

  return (
    <section id="games" aria-labelledby="games-title" className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10">
      <SectionHeading n="07" id="games-title" title="Pausa pro café" />
      <p className="mt-4 max-w-2xl text-muted md:text-lg">
        Entre uma seção e outra, seis joguinhos que escrevi do zero, sem biblioteca de jogo. Os recordes ficam salvos no seu navegador.
      </p>

      <div
        role="tablist"
        aria-label="Escolha o jogo"
        onKeyDown={onKeyDown}
        className="mt-8 flex flex-wrap gap-2"
      >
        {games.map((gm, i) => (
          <button
            key={gm.id}
            type="button"
            role="tab"
            id={`game-tab-${gm.id}`}
            aria-selected={i === index}
            aria-controls="game-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              i === index
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-line text-muted hover:border-accent/60 hover:text-fg'
            }`}
          >
            {gm.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {game.hint}
      </p>

      <div
        ref={hostRef}
        id="game-panel"
        role="tabpanel"
        aria-labelledby={`game-tab-${game.id}`}
        className="mt-8 flex min-h-[34rem] justify-center rounded-3xl border border-line bg-bg/55 p-5 backdrop-blur-md md:p-8"
      >
        {near ? (
          <Suspense fallback={<p className="self-center font-mono text-xs uppercase tracking-[0.2em] text-muted">Carregando…</p>}>
            <game.Comp key={game.id} />
          </Suspense>
        ) : null}
      </div>
    </section>
  )
}
