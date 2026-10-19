import { useEffect, useState } from 'react'
import { GameButton, Stat } from './shared'

type Cell = 'X' | 'O' | null
type Mode = 'cpu' | 'hard' | 'friend'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function result(b: Cell[]): { winner: 'X' | 'O'; line: number[] } | 'draw' | null {
  for (const l of LINES) {
    const [a, c, d] = l
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line: l }
  }
  return b.every(Boolean) ? 'draw' : null
}

/** Perfect play: a full minimax search (the board is tiny). O maximises, X minimises. */
function minimax(b: Cell[], turn: 'X' | 'O', depth: number): number {
  const r = result(b)
  if (r === 'draw') return 0
  if (r) return r.winner === 'O' ? 10 - depth : depth - 10
  let best = turn === 'O' ? -Infinity : Infinity
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    b[i] = turn
    const v = minimax(b, turn === 'O' ? 'X' : 'O', depth + 1)
    b[i] = null
    best = turn === 'O' ? Math.max(best, v) : Math.min(best, v)
  }
  return best
}

function hardMove(b: Cell[]): number {
  let best = -Infinity
  let move = -1
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    b[i] = 'O'
    const v = minimax(b, 'X', 1)
    b[i] = null
    if (v > best) {
      best = v
      move = i
    }
  }
  return move
}

/** Easy-ish CPU: win if possible, block the opponent, then center, corners, sides. Beatable on purpose. */
function cpuMove(b: Cell[]): number {
  const free = b.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  for (const who of ['O', 'X'] as const) {
    for (const [x, y, z] of LINES) {
      const cells = [x, y, z]
      const mine = cells.filter((i) => b[i] === who)
      const empty = cells.filter((i) => !b[i])
      if (mine.length === 2 && empty.length === 1) return empty[0]
    }
  }
  if (!b[4]) return 4
  const pick = (arr: number[]) => {
    const ok = arr.filter((i) => free.includes(i))
    return ok.length ? ok[Math.floor(Math.random() * ok.length)] : -1
  }
  const corner = pick([0, 2, 6, 8])
  return corner >= 0 ? corner : pick([1, 3, 5, 7])
}

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const [mode, setMode] = useState<Mode>('cpu')
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 })

  const res = result(board)

  // CPU plays O after a short beat
  useEffect(() => {
    if (mode === 'friend' || turn !== 'O' || res) return
    const id = setTimeout(() => play(mode === 'hard' ? hardMove(board.slice()) : cpuMove(board)), 450)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, mode, res])

  function play(i: number) {
    if (board[i] || res) return
    const next = board.slice()
    next[i] = turn
    const r = result(next)
    setBoard(next)
    if (r) {
      setScore((s) => (r === 'draw' ? { ...s, draw: s.draw + 1 } : { ...s, [r.winner]: s[r.winner] + 1 }))
    } else {
      setTurn(turn === 'X' ? 'O' : 'X')
    }
  }

  function again() {
    setBoard(Array(9).fill(null))
    setTurn('X')
  }

  function changeMode(m: Mode) {
    setMode(m)
    setScore({ X: 0, O: 0, draw: 0 })
    again()
  }

  const names = mode !== 'friend' ? { X: 'Você', O: 'CPU' } : { X: 'Jogador X', O: 'Jogador O' }
  const status = res
    ? res === 'draw'
      ? 'Deu velha!'
      : `${names[res.winner]} venceu!`
    : mode !== 'friend' && turn === 'O'
      ? 'CPU pensando…'
      : `Vez de ${names[turn]}`
  const winLine = res && res !== 'draw' ? res.line : []

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-5">
      <div className="flex w-full max-w-[420px] items-end justify-between">
        <Stat label={names.X} value={score.X} />
        <Stat label="Velha" value={score.draw} />
        <Stat label={names.O} value={score.O} />
      </div>

      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Modo de jogo">
        {(['cpu', 'hard', 'friend'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => changeMode(m)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-line text-muted hover:border-accent/60 hover:text-fg'
            }`}
          >
            {m === 'cpu' ? 'CPU' : m === 'hard' ? 'CPU difícil' : 'Amigo'}
          </button>
        ))}
      </div>

      <div className="grid aspect-square w-full max-w-[420px] grid-cols-3 gap-2 rounded-2xl border border-line bg-bg/70 p-3 shadow-[0_0_60px_-24px_var(--color-accent)]">
        {board.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => play(i)}
            disabled={!!c || !!res || (mode !== 'friend' && turn === 'O')}
            aria-label={`Casa ${i + 1}${c ? `: ${c}` : ''}`}
            className={`cursor-pointer rounded-xl border font-display text-5xl font-bold transition-colors enabled:hover:border-accent/60 enabled:hover:bg-accent/5 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-6xl ${
              winLine.includes(i) ? 'border-accent bg-accent/15' : 'border-line bg-bg/40'
            } ${c === 'X' ? 'text-accent' : 'text-accent-2'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="min-h-6 font-mono text-sm text-fg" aria-live="polite">
        {status}
      </p>
      <GameButton onClick={again}>Nova partida</GameButton>
    </div>
  )
}
