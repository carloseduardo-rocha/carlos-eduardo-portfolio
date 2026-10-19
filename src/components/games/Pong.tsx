import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { GameButton, SIZE, Stat, canvasClass, overlay, prepareCanvas, useLoop, usePalette } from './shared'

const PW = 8
const PH = 68
const PX = 16
const WIN = 7
const LEVELS = { Fácil: 150, Normal: 215, Difícil: 290 } as const
type Level = keyof typeof LEVELS
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

type Phase = 'idle' | 'run' | 'paused' | 'over'

export function Pong() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const pal = usePalette()
  const [score, setScore] = useState({ you: 0, cpu: 0 })
  const [phase, setPhaseState] = useState<Phase>('idle')
  const [level, setLevel] = useState<Level>('Normal')
  const cpuSpeed = useRef<number>(LEVELS.Normal)

  const g = useRef({
    phase: 'idle' as Phase,
    py: SIZE / 2,
    ty: SIZE / 2,
    cy: SIZE / 2,
    ball: { x: SIZE / 2, y: SIZE / 2, vx: 0, vy: 0 },
    you: 0,
    cpu: 0,
    up: false,
    down: false,
  })

  function setPhase(p: Phase) {
    g.current.phase = p
    setPhaseState(p)
  }

  function serve(dir: 1 | -1) {
    const b = g.current.ball
    b.x = SIZE / 2
    b.y = SIZE / 2
    const a = (Math.random() - 0.5) * 0.9
    const sp = 250
    b.vx = Math.cos(a) * sp * dir
    b.vy = Math.sin(a) * sp
  }

  function restart() {
    const s = g.current
    s.you = 0
    s.cpu = 0
    s.py = s.ty = s.cy = SIZE / 2
    setScore({ you: 0, cpu: 0 })
    serve(1)
    setPhase('run')
  }

  function begin() {
    const p = g.current.phase
    if (p === 'idle' || p === 'over') restart()
    else if (p === 'paused') setPhase('run')
  }

  function point(who: 'you' | 'cpu') {
    const s = g.current
    s[who] += 1
    setScore({ you: s.you, cpu: s.cpu })
    if (s[who] >= WIN) {
      setPhase('over')
      return
    }
    serve(who === 'you' ? -1 : 1)
  }

  function update(dt: number) {
    const s = g.current
    // player: keys move the target, pointer sets it directly
    if (s.up) s.ty -= 380 * dt
    if (s.down) s.ty += 380 * dt
    s.ty = clamp(s.ty, PH / 2, SIZE - PH / 2)
    s.py += (s.ty - s.py) * Math.min(1, dt * 22)

    // cpu: chases the ball with a speed cap and a dead zone, so it can be beaten
    const b = s.ball
    const aim = b.vx > 0 ? b.y : SIZE / 2
    const diff = aim - s.cy
    if (Math.abs(diff) > 10) s.cy += Math.sign(diff) * Math.min(Math.abs(diff), cpuSpeed.current * dt)
    s.cy = clamp(s.cy, PH / 2, SIZE - PH / 2)

    b.x += b.vx * dt
    b.y += b.vy * dt
    if (b.y < 6) { b.y = 6; b.vy = Math.abs(b.vy) }
    if (b.y > SIZE - 6) { b.y = SIZE - 6; b.vy = -Math.abs(b.vy) }

    const hit = (py: number, left: boolean) => {
      const px = left ? PX + PW : SIZE - PX - PW
      const inX = left ? b.x - 6 <= px && b.x > PX - 4 && b.vx < 0 : b.x + 6 >= px && b.x < SIZE - PX + 4 && b.vx > 0
      if (!inX || Math.abs(b.y - py) > PH / 2 + 6) return
      const off = clamp((b.y - py) / (PH / 2), -1, 1)
      const sp = Math.min(Math.hypot(b.vx, b.vy) * 1.06, 520)
      const ang = off * 0.95
      b.vx = Math.cos(ang) * sp * (left ? 1 : -1)
      b.vy = Math.sin(ang) * sp
      b.x = left ? px + 6 : px - 6
    }
    hit(s.py, true)
    hit(s.cy, false)

    if (b.x < -10) point('cpu')
    else if (b.x > SIZE + 10) point('you')
  }

  function draw() {
    const ctx = ctxRef.current
    if (!ctx) return
    const p = pal.current
    const s = g.current
    ctx.fillStyle = p.bg
    ctx.fillRect(0, 0, SIZE, SIZE)

    ctx.strokeStyle = p.line
    ctx.lineWidth = 2
    ctx.setLineDash([8, 10])
    ctx.beginPath()
    ctx.moveTo(SIZE / 2, 0)
    ctx.lineTo(SIZE / 2, SIZE)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.textAlign = 'center'
    ctx.font = '700 40px "Space Grotesk Variable", sans-serif'
    ctx.fillStyle = p.line
    ctx.fillText(String(s.you), SIZE / 2 - 56, 56)
    ctx.fillText(String(s.cpu), SIZE / 2 + 56, 56)

    ctx.fillStyle = p.accent
    ctx.beginPath()
    ctx.roundRect(PX, s.py - PH / 2, PW, PH, 4)
    ctx.fill()
    ctx.fillStyle = p.accent2
    ctx.beginPath()
    ctx.roundRect(SIZE - PX - PW, s.cy - PH / 2, PW, PH, 4)
    ctx.fill()

    ctx.save()
    ctx.shadowColor = p.fg
    ctx.shadowBlur = 12
    ctx.fillStyle = p.fg
    ctx.beginPath()
    ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    if (s.phase === 'idle') overlay(ctx, p, 'Pong', 'Setas, W/S ou arraste · primeiro a 7')
    if (s.phase === 'paused') overlay(ctx, p, 'Pausado', 'Toque ou aperte espaço para continuar')
    if (s.phase === 'over') overlay(ctx, p, s.you >= WIN ? 'Você venceu!' : 'A CPU venceu', 'Toque ou espaço para jogar de novo')
  }

  useEffect(() => {
    if (canvas.current) {
      ctxRef.current = prepareCanvas(canvas.current)
      draw()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLoop((dt) => {
    if (g.current.phase === 'run') update(dt)
    draw()
  }, wrap)

  const key = (down: boolean) => (e: KeyboardEvent) => {
    const k = e.key
    if (k === 'ArrowUp' || k === 'w' || k === 'W') {
      g.current.up = down
      e.preventDefault()
      if (down) begin()
    } else if (k === 'ArrowDown' || k === 's' || k === 'S') {
      g.current.down = down
      e.preventDefault()
      if (down) begin()
    } else if (k === ' ' && down) {
      e.preventDefault()
      if (g.current.phase === 'run') setPhase('paused')
      else begin()
    }
  }

  const aim = (e: PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    g.current.ty = clamp(((e.clientY - r.top) / r.height) * SIZE, PH / 2, SIZE - PH / 2)
  }

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={key(true)}
      onKeyUp={key(false)}
      onBlur={() => {
        g.current.up = g.current.down = false
      }}
      className="flex flex-col items-center gap-4 outline-none"
      aria-label="Pong. Use as setas ou W e S."
    >
      <div className="flex w-full max-w-[420px] items-end justify-between">
        <Stat label="Você" value={score.you} />
        <GameButton onClick={() => (phase === 'run' ? setPhase('paused') : begin())}>
          {phase === 'run' ? 'Pausar' : phase === 'paused' ? 'Continuar' : 'Jogar'}
        </GameButton>
        <Stat label="CPU" value={score.cpu} />
      </div>
      <div className="flex gap-2" role="group" aria-label="Dificuldade">
        {(Object.keys(LEVELS) as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={level === l}
            onClick={() => {
              setLevel(l)
              cpuSpeed.current = LEVELS[l]
            }}
            className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              level === l ? 'border-accent bg-accent/15 text-accent' : 'border-line text-muted hover:border-accent/60 hover:text-fg'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <canvas
        ref={canvas}
        onPointerDown={(e) => {
          wrap.current?.focus({ preventScroll: true })
          aim(e)
          begin()
        }}
        onPointerMove={aim}
        className={canvasClass}
        role="img"
        aria-label="Campo do jogo Pong"
      />
    </div>
  )
}
