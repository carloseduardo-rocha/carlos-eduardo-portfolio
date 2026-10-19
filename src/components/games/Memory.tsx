import { useEffect, useRef, useState } from 'react'
import { GameButton, Stat } from './shared'

const TECH = ['Java', 'Spring', 'Python', 'Flask', 'React', 'Docker', 'Git', 'Postgres']
const KEY = 'portfolio:memoryBest'

type Card = { id: number; tech: string }

function deal(): Card[] {
  const cards = [...TECH, ...TECH].map((tech, i) => ({ id: i, tech }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

function readBest() {
  try {
    return Number(localStorage.getItem(KEY)) || 0
  } catch {
    return 0
  }
}

export function Memory() {
  const [cards, setCards] = useState(deal)
  const [open, setOpen] = useState<number[]>([])
  const [done, setDone] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [best, setBest] = useState(readBest)
  const lock = useRef(false)

  const won = done.size === TECH.length

  useEffect(() => {
    if (!won) return
    setBest((b) => {
      const next = b === 0 ? moves : Math.min(b, moves)
      try {
        localStorage.setItem(KEY, String(next))
      } catch {
        /* storage unavailable */
      }
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won])

  function flip(i: number) {
    if (lock.current || open.includes(i) || done.has(cards[i].tech) || won) return
    const next = [...open, i]
    setOpen(next)
    if (next.length < 2) return
    setMoves((m) => m + 1)
    const [a, b] = next
    if (cards[a].tech === cards[b].tech) {
      setDone((d) => new Set(d).add(cards[a].tech))
      setOpen([])
    } else {
      lock.current = true
      setTimeout(() => {
        setOpen([])
        lock.current = false
      }, 750)
    }
  }

  function restart() {
    lock.current = false
    setCards(deal())
    setOpen([])
    setDone(new Set())
    setMoves(0)
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-4">
      <div className="flex w-full items-end justify-between">
        <Stat label="Jogadas" value={moves} />
        <GameButton onClick={restart}>Embaralhar</GameButton>
        <Stat label="Recorde" value={best || '–'} />
      </div>

      <ul className="grid w-full grid-cols-4 gap-2.5" aria-label="Cartas">
        {cards.map((c, i) => {
          const shown = open.includes(i) || done.has(c.tech)
          return (
            <li key={c.id} className="[perspective:600px]">
              <button
                type="button"
                onClick={() => flip(i)}
                aria-label={shown ? c.tech : 'Carta virada para baixo'}
                aria-pressed={shown}
                className="relative aspect-[3/4] w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{ transform: shown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                <span className="absolute inset-0 grid place-items-center rounded-xl border border-line bg-bg/60 text-accent shadow-[inset_0_0_24px_-10px_var(--color-accent)] [backface-visibility:hidden] hover:border-accent/60">
                  <span className="font-display text-xl font-bold">CE</span>
                </span>
                <span
                  className={`absolute inset-0 grid place-items-center rounded-xl border px-1 text-center font-display text-[0.8rem] font-bold [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-sm ${
                    done.has(c.tech) ? 'border-accent bg-accent/20 text-accent' : 'border-line bg-bg text-fg'
                  }`}
                >
                  {c.tech}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="min-h-6 font-mono text-sm text-fg" aria-live="polite">
        {won ? `Completou em ${moves} jogadas!` : `${done.size} de ${TECH.length} pares`}
      </p>
    </div>
  )
}
