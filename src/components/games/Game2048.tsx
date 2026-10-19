import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GameButton, Stat, useBest } from './shared'

const N = 4
type Board = number[]

function spawn(b: Board): Board {
  const free = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
  if (!free.length) return b
  const next = b.slice()
  next[free[Math.floor(Math.random() * free.length)]] = Math.random() < 0.9 ? 2 : 4
  return next
}

function fresh(): Board {
  return spawn(spawn(Array(N * N).fill(0)))
}

/** Slides one line to the front, merging equal neighbours once. */
function slide(line: number[]) {
  const vals = line.filter(Boolean)
  const out: number[] = []
  let gain = 0
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2)
      gain += vals[i] * 2
      i++
    } else {
      out.push(vals[i])
    }
  }
  while (out.length < N) out.push(0)
  return { out, gain }
}

function move(b: Board, dir: 'left' | 'right' | 'up' | 'down') {
  let gain = 0
  const next = b.slice()
  for (let k = 0; k < N; k++) {
    const idx = Array.from({ length: N }, (_, j) =>
      dir === 'left' || dir === 'right' ? k * N + j : j * N + k,
    )
    if (dir === 'right' || dir === 'down') idx.reverse()
    const { out, gain: g } = slide(idx.map((i) => b[i]))
    gain += g
    idx.forEach((i, j) => (next[i] = out[j]))
  }
  const changed = next.some((v, i) => v !== b[i])
  return { next, gain, changed }
}

function stuck(b: Board) {
  return (['left', 'right', 'up', 'down'] as const).every((d) => !move(b, d).changed)
}

const TONES: Record<number, string> = {
  2: '10%',
  4: '16%',
  8: '24%',
  16: '32%',
  32: '42%',
  64: '52%',
  128: '62%',
  256: '70%',
  512: '78%',
  1024: '86%',
  2048: '96%',
}

export function Game2048() {
  const [board, setBoard] = useState<Board>(fresh)
  const [score, setScore] = useState(0)
  const [best, saveBest] = useBest('portfolio:2048Best')
  const wrap = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)

  const over = stuck(board)
  const won = board.includes(2048)

  function go(dir: 'left' | 'right' | 'up' | 'down') {
    if (over) return
    const { next, gain, changed } = move(board, dir)
    if (!changed) return
    setBoard(spawn(next))
    const total = score + gain
    setScore(total)
    saveBest(total)
  }

  function restart() {
    setBoard(fresh())
    setScore(0)
  }

  const onKey = (e: KeyboardEvent) => {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' } as const
    const d = map[e.key as keyof typeof map]
    if (!d) return
    e.preventDefault()
    go(d)
  }

  const down = (e: PointerEvent) => {
    wrap.current?.focus({ preventScroll: true })
    start.current = { x: e.clientX, y: e.clientY }
  }
  const up = (e: PointerEvent) => {
    const s = start.current
    start.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 'right' : 'left')
    else go(dy > 0 ? 'down' : 'up')
  }

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={onKey}
      className="flex w-full max-w-[420px] flex-col items-center gap-4 outline-none"
      aria-label="2048. Use as setas para juntar números iguais."
    >
      <div className="flex w-full items-end justify-between">
        <Stat label="Pontos" value={score} />
        <GameButton onClick={restart}>Novo jogo</GameButton>
        <Stat label="Recorde" value={best} />
      </div>

      <div
        onPointerDown={down}
        onPointerUp={up}
        className="relative grid aspect-square w-full touch-none grid-cols-4 gap-2 rounded-2xl border border-line bg-bg/70 p-2.5 shadow-[0_0_60px_-24px_var(--color-accent)]"
      >
        {board.map((v, i) => (
          <div
            key={`${i}-${v}`}
            className={`grid place-items-center rounded-xl font-display font-bold ${v ? 'tile-pop' : ''} ${
              v >= 1024 ? 'text-xl' : v >= 128 ? 'text-2xl' : 'text-3xl'
            } ${v >= 8 ? 'text-bg' : 'text-fg'}`}
            style={{
              background: v
                ? `color-mix(in srgb, var(--color-accent) ${TONES[v] ?? '100%'}, var(--color-bg))`
                : 'color-mix(in srgb, var(--color-fg) 6%, transparent)',
            }}
          >
            {v || ''}
          </div>
        ))}
        {(over || won) && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-bg/75 text-center backdrop-blur-sm">
            <div>
              <p className="font-display text-2xl font-bold">{won ? 'Chegou no 2048!' : 'Sem movimentos'}</p>
              <p className="mt-1 text-sm text-accent">{score} pontos</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-center font-mono text-xs text-muted">Setas, WASD ou deslize para juntar números iguais.</p>
    </div>
  )
}
