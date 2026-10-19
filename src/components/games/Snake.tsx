import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GameButton, SIZE, Stat, canvasClass, overlay, prepareCanvas, useBest, useLoop, usePalette } from './shared'

const N = 20
const CELL = SIZE / N
const STEP_START = 0.115 // seconds per cell; the snake speeds up as it grows
const STEP_MIN = 0.068
const BONUS_TTL = 7

type P = { x: number; y: number }
type Phase = 'idle' | 'run' | 'over'
type Spark = { x: number; y: number; vx: number; vy: number; life: number; gold: boolean }

const stepTime = (score: number) => Math.max(STEP_MIN, STEP_START - Math.floor(score / 4) * 0.007)

const START: P[] = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
]

function randomFood(snake: P[]): P {
  for (;;) {
    const f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Little face on the head: eyes that look where it is going, and a forked tongue that flicks. */
function drawFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: P, time: number) {
  const px = -dir.y // perpendicular
  const py = dir.x
  const flick = Math.sin(time * 9) > 0.35
  if (flick) {
    const bx = cx + dir.x * CELL * 0.5
    const by = cy + dir.y * CELL * 0.5
    const tx = bx + dir.x * 6
    const ty = by + dir.y * 6
    ctx.strokeStyle = '#ff4d6d'
    ctx.lineWidth = 1.6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.lineTo(tx, ty)
    ctx.moveTo(tx, ty)
    ctx.lineTo(tx + dir.x * 3 + px * 2.5, ty + dir.y * 3 + py * 2.5)
    ctx.moveTo(tx, ty)
    ctx.lineTo(tx + dir.x * 3 - px * 2.5, ty + dir.y * 3 - py * 2.5)
    ctx.stroke()
  }
  for (const side of [-1, 1]) {
    const ex = cx + dir.x * 2.2 + px * side * 4.6
    const ey = cy + dir.y * 2.2 + py * side * 4.6
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgb(0 0 0 / 0.55)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(ex, ey, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#0b1324'
    ctx.beginPath()
    ctx.arc(ex + dir.x * 1.5, ey + dir.y * 1.5, 2.1, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function Snake() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const pal = usePalette()
  const [score, setScore] = useState(0)
  const [best, saveBest] = useBest('portfolio:snakeBest')
  const touch = useRef<P | null>(null)

  const g = useRef({
    snake: START.map((p) => ({ ...p })),
    prev: START.map((p) => ({ ...p })),
    dir: { x: 1, y: 0 } as P,
    queue: [] as P[],
    food: { x: 14, y: 10 } as P,
    bonus: null as (P & { ttl: number }) | null,
    sparks: [] as Spark[],
    acc: 0,
    time: 0,
    phase: 'idle' as Phase,
    score: 0,
  })

  function reset() {
    const s = g.current
    s.snake = START.map((p) => ({ ...p }))
    s.prev = START.map((p) => ({ ...p }))
    s.dir = { x: 1, y: 0 }
    s.queue = []
    s.food = randomFood(s.snake)
    s.bonus = null
    s.sparks = []
    s.acc = 0
    s.score = 0
    setScore(0)
  }

  function turn(dx: number, dy: number) {
    const s = g.current
    if (s.phase === 'over') {
      reset()
      s.phase = 'run'
    } else if (s.phase === 'idle') {
      s.phase = 'run'
    }
    const last = s.queue[s.queue.length - 1] ?? s.dir
    if ((dx === -last.x && dy === -last.y) || (dx === last.x && dy === last.y)) return
    if (s.queue.length < 2) s.queue.push({ x: dx, y: dy })
  }

  function burst(at: P, gold: boolean) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + Math.random() * 0.5
      const v = 40 + Math.random() * 70
      g.current.sparks.push({ x: (at.x + 0.5) * CELL, y: (at.y + 0.5) * CELL, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5, gold })
    }
  }

  function step() {
    const s = g.current
    if (s.queue.length) s.dir = s.queue.shift()!
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }
    const eatsFood = head.x === s.food.x && head.y === s.food.y
    const eatsBonus = !!s.bonus && head.x === s.bonus.x && head.y === s.bonus.y
    const eats = eatsFood || eatsBonus
    const body = eats ? s.snake : s.snake.slice(0, -1)
    if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || body.some((b) => b.x === head.x && b.y === head.y)) {
      s.phase = 'over'
      saveBest(s.score)
      return
    }
    s.prev = s.snake.map((p) => ({ ...p }))
    s.snake.unshift(head)
    if (eats) {
      burst(head, eatsBonus)
      s.score += eatsBonus ? 3 : 1
      setScore(s.score)
      if (eatsBonus) s.bonus = null
      if (eatsFood) {
        s.food = randomFood(s.snake)
        if (!s.bonus && s.score >= 3 && Math.random() < 0.3) {
          const b = randomFood([...s.snake, s.food])
          s.bonus = { ...b, ttl: BONUS_TTL }
        }
      }
    } else {
      s.snake.pop()
    }
  }

  function draw() {
    const ctx = ctxRef.current
    if (!ctx) return
    const p = pal.current
    const s = g.current
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.fillStyle = p.bg
    ctx.fillRect(0, 0, SIZE, SIZE)

    // faint grid dots
    ctx.fillStyle = p.line
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) ctx.fillRect(x * CELL + CELL / 2 - 0.75, y * CELL + CELL / 2 - 0.75, 1.5, 1.5)

    // food, softly pulsing
    const pulse = 1 + Math.sin(performance.now() / 220) * 0.12
    ctx.save()
    ctx.shadowColor = p.accent2
    ctx.shadowBlur = 14
    ctx.fillStyle = p.accent2
    ctx.beginPath()
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL * 0.34 * pulse, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    if (s.bonus) {
      const blink = s.bonus.ttl < 2 && Math.floor(s.time * 6) % 2 === 0
      if (!blink) {
        ctx.save()
        ctx.shadowColor = '#ffc233'
        ctx.shadowBlur = 16
        ctx.fillStyle = '#ffc233'
        ctx.beginPath()
        const cx = s.bonus.x * CELL + CELL / 2
        const cy = s.bonus.y * CELL + CELL / 2
        for (let k = 0; k < 10; k++) {
          const r = k % 2 === 0 ? CELL * 0.46 : CELL * 0.2
          const a = (k / 10) * Math.PI * 2 - Math.PI / 2 + s.time * 1.5
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    // snake, drawn tail → head so the head stays on top; interpolated between cells
    const t = s.phase === 'run' ? Math.min(s.acc / stepTime(s.score), 1) : 1
    for (let i = s.snake.length - 1; i >= 0; i--) {
      const from = s.prev[i] ?? s.prev[s.prev.length - 1]
      const to = s.snake[i]
      const x = lerp(from.x, to.x, t) * CELL
      const y = lerp(from.y, to.y, t) * CELL
      ctx.globalAlpha = i === 0 ? 1 : Math.max(0.4, 0.92 - i * 0.025)
      ctx.fillStyle = p.accent
      ctx.beginPath()
      ctx.roundRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3, i === 0 ? 7 : 5)
      ctx.fill()
      if (i === 0) drawFace(ctx, x + CELL / 2, y + CELL / 2, s.dir, s.time)
    }
    ctx.globalAlpha = 1

    for (const sp of s.sparks) {
      ctx.globalAlpha = Math.max(0, sp.life * 2)
      ctx.fillStyle = sp.gold ? '#ffc233' : p.accent2
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    if (s.phase === 'idle') overlay(ctx, p, 'Snake', 'Setas, WASD ou deslize para começar', -70)
    if (s.phase === 'over') overlay(ctx, p, 'Game over', 'Qualquer direção reinicia', -70)
  }

  useEffect(() => {
    if (canvas.current) {
      ctxRef.current = prepareCanvas(canvas.current)
      draw()
    }
    // draw once on mount; the loop takes over after that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLoop((dt) => {
    const s = g.current
    s.time += dt
    if (s.phase === 'run') {
      s.acc += dt
      let st = stepTime(s.score)
      while (s.acc >= st && s.phase === 'run') {
        s.acc -= st
        step()
        st = stepTime(s.score)
      }
      if (s.bonus) {
        s.bonus.ttl -= dt
        if (s.bonus.ttl <= 0) s.bonus = null
      }
    }
    for (const sp of s.sparks) {
      sp.x += sp.vx * dt
      sp.y += sp.vy * dt
      sp.life -= dt
    }
    s.sparks = s.sparks.filter((sp) => sp.life > 0)
    draw()
  }, wrap)

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, [number, number]> = {
      ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
      ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
      ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
    }
    const d = map[e.key]
    if (!d) return
    e.preventDefault()
    turn(d[0], d[1])
  }

  const onDown = (e: PointerEvent) => {
    wrap.current?.focus({ preventScroll: true })
    touch.current = { x: e.clientX, y: e.clientY }
  }
  const onUp = (e: PointerEvent) => {
    const t = touch.current
    touch.current = null
    if (!t) return
    const dx = e.clientX - t.x
    const dy = e.clientY - t.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
      if (g.current.phase !== 'run') turn(g.current.dir.x, g.current.dir.y)
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0)
    else turn(0, Math.sign(dy))
  }

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={onKey}
      className="flex flex-col items-center gap-4 outline-none"
      aria-label="Snake. Use as setas ou WASD."
    >
      <div className="flex w-full max-w-[420px] items-end justify-between">
        <Stat label="Pontos" value={score} />
        <GameButton onClick={() => { reset(); g.current.phase = 'idle'; draw() }}>Reiniciar</GameButton>
        <Stat label="Recorde" value={best} />
      </div>
      <canvas
        ref={canvas}
        onPointerDown={onDown}
        onPointerUp={onUp}
        className={canvasClass}
        role="img"
        aria-label="Campo do jogo Snake"
      />
      <div className="grid grid-cols-3 gap-1.5 md:hidden" aria-hidden="true">
        <span />
        <Pad label="↑" onPress={() => turn(0, -1)} />
        <span />
        <Pad label="←" onPress={() => turn(-1, 0)} />
        <Pad label="↓" onPress={() => turn(0, 1)} />
        <Pad label="→" onPress={() => turn(1, 0)} />
      </div>
    </div>
  )
}

function Pad({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
      className="size-12 rounded-xl border border-line bg-bg/60 text-lg text-fg active:border-accent active:text-accent"
    >
      {label}
    </button>
  )
}
