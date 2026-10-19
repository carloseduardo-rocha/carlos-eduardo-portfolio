import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { GameButton, SIZE, Stat, canvasClass, prepareCanvas, useBest, useLoop, usePalette, type Palette } from './shared'

// A flappy-style game: the classic red Java cup dodges "AI sentinels". Piadinha: today everything became AI.
const GRAVITY = 0.45
const FLAP = -7.2
const PIPE_W = 60
const GAP = 150
const SPEED = 2.4
const CUP_R = 16
const HIT_R = 11
const SPAWN_EVERY = 200
const TICK = 1 / 60

type Pipe = { x: number; gapY: number; passed: boolean; seed: number }
type Phase = 'idle' | 'run' | 'over'

function drawJava(ctx: CanvasRenderingContext2D, r: number) {
  const cupW = r * 1.8
  const cupH = r * 1.7

  ctx.strokeStyle = 'rgb(255 255 255 / 0.75)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (const dx of [-r * 0.4, r * 0.35]) {
    ctx.beginPath()
    ctx.moveTo(dx, -cupH * 0.55)
    ctx.bezierCurveTo(dx - r * 0.5, -cupH * 0.9, dx + r * 0.5, -cupH * 1.15, dx, -cupH * 1.5)
    ctx.stroke()
  }

  ctx.fillStyle = '#4e7ca8'
  ctx.beginPath()
  ctx.ellipse(0, cupH * 0.5, cupW * 0.95, r * 0.42, 0, 0, Math.PI * 2)
  ctx.fill()

  const grad = ctx.createLinearGradient(0, -cupH * 0.5, 0, cupH * 0.5)
  grad.addColorStop(0, '#f0663c')
  grad.addColorStop(1, '#d33a24')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(-cupW / 2, -cupH * 0.45, cupW, cupH * 0.9, 5)
  ctx.fill()

  ctx.fillStyle = '#ffd9c9'
  ctx.beginPath()
  ctx.ellipse(0, -cupH * 0.45, cupW / 2, r * 0.22, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#d33a24'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cupW / 2 + 1, 0, r * 0.55, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()
}

/** One sentinel slab: circuit-board monolith with a robot face guarding the gap edge. */
function drawSentinel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  seed: number,
  faceY: number,
  faceDir: 1 | -1,
  glow: string,
) {
  if (height <= 0) return
  const w = PIPE_W
  const cx = x + w / 2

  const g = ctx.createLinearGradient(x, 0, x + w, 0)
  g.addColorStop(0, '#1a2540')
  g.addColorStop(0.5, '#243356')
  g.addColorStop(1, '#1a2540')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.roundRect(x, y, w, height, 5)
  ctx.fill()
  ctx.strokeStyle = glow
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.8
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, height, 5)
  ctx.clip()
  ctx.strokeStyle = glow
  ctx.fillStyle = glow
  const lanes = [x + w * 0.3, x + w * 0.5, x + w * 0.7]
  for (const lx of lanes) {
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(lx, y - 4)
    ctx.lineTo(lx, y + height + 4)
    ctx.stroke()
  }
  const step = 26
  for (let row = 0; row * step < height + step; row++) {
    const ny = y + 12 + row * step + (seed % step)
    const lane = (row + Math.floor(seed)) % 3
    const other = (lane + 1 + (row % 2)) % 3
    ctx.globalAlpha = 0.4
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(lanes[lane], ny)
    ctx.lineTo(lanes[other], ny + step * 0.5)
    ctx.stroke()
    ctx.globalAlpha = 0.95
    ctx.beginPath()
    ctx.arc(lanes[lane], ny, 2.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  ctx.globalAlpha = 1

  ctx.fillStyle = glow
  ctx.fillRect(x - 3, faceDir === 1 ? y + height - 4 : y, w + 6, 4)

  const s = 13
  ctx.fillStyle = '#0f1830'
  ctx.strokeStyle = glow
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(cx - s, faceY - s * 0.8, s * 2, s * 1.6, 4)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, faceY - faceDir * s * 0.8)
  ctx.lineTo(cx, faceY - faceDir * s * 1.5)
  ctx.stroke()
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, faceY - faceDir * s * 1.5, 2.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.save()
  ctx.shadowColor = glow
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(cx - s * 0.4, faceY - s * 0.05, s * 0.22, 0, Math.PI * 2)
  ctx.arc(cx + s * 0.4, faceY - s * 0.05, s * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = glow
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.45, faceY + s * 0.45)
  ctx.lineTo(cx + s * 0.45, faceY + s * 0.45)
  ctx.stroke()
}

function text(ctx: CanvasRenderingContext2D, pal: Palette, big: string, small: string, y: number) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = pal.fg
  ctx.font = '700 22px "Space Grotesk Variable", "Inter Variable", sans-serif'
  ctx.fillText(big, SIZE / 2, y)
  ctx.fillStyle = pal.muted
  ctx.font = '500 13px "Inter Variable", sans-serif'
  ctx.fillText(small, SIZE / 2, y + 26)
}

export function JavaVsAI() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const pal = usePalette()
  const [score, setScore] = useState(0)
  const [best, saveBest] = useBest('portfolio:javaVsAiBest')

  const g = useRef({
    y: SIZE / 2,
    v: 0,
    pipes: [] as Pipe[],
    score: 0,
    phase: 'idle' as Phase,
    spawn: SPAWN_EVERY,
    acc: 0,
  })

  function reset() {
    const s = g.current
    s.y = SIZE / 2
    s.v = 0
    s.pipes = []
    s.score = 0
    s.spawn = SPAWN_EVERY
    s.acc = 0
    s.phase = 'idle'
    setScore(0)
  }

  function flap() {
    const s = g.current
    if (s.phase === 'over') reset()
    s.phase = 'run'
    s.v = FLAP
  }

  function over() {
    const s = g.current
    s.phase = 'over'
    saveBest(s.score)
  }

  function tick() {
    const s = g.current
    const birdX = SIZE * 0.28
    s.v += GRAVITY
    s.y += s.v
    if (s.y < HIT_R) {
      s.y = HIT_R
      s.v = 0
    }
    if (s.y > SIZE - HIT_R) {
      s.y = SIZE - HIT_R
      over()
      return
    }

    s.spawn -= SPEED
    if (s.spawn <= 0) {
      const margin = 50
      s.pipes.push({ x: SIZE, gapY: margin + Math.random() * (SIZE - GAP - margin * 2), passed: false, seed: Math.random() * 1000 })
      s.spawn = SPAWN_EVERY
    }

    for (const p of s.pipes) {
      p.x -= SPEED
      if (!p.passed && p.x + PIPE_W < birdX) {
        p.passed = true
        s.score += 1
        setScore(s.score)
      }
      const inX = birdX + HIT_R > p.x && birdX - HIT_R < p.x + PIPE_W
      const through = s.y - HIT_R > p.gapY && s.y + HIT_R < p.gapY + GAP
      if (inX && !through) over()
    }
    s.pipes = s.pipes.filter((p) => p.x + PIPE_W > -10)
  }

  function draw() {
    const ctx = ctxRef.current
    if (!ctx) return
    const p = pal.current
    const s = g.current
    ctx.fillStyle = p.bg
    ctx.fillRect(0, 0, SIZE, SIZE)

    for (const pipe of s.pipes) {
      const bottom = pipe.gapY + GAP
      drawSentinel(ctx, pipe.x, 0, pipe.gapY, pipe.seed, pipe.gapY - 14, 1, p.accent)
      drawSentinel(ctx, pipe.x, bottom, SIZE - bottom, pipe.seed + 1, bottom + 14, -1, p.accent)
    }

    ctx.save()
    ctx.translate(SIZE * 0.28, s.y)
    ctx.rotate(Math.max(-0.25, Math.min(0.5, s.v / 22)))
    drawJava(ctx, CUP_R)
    ctx.restore()

    if (s.phase === 'run') {
      ctx.textAlign = 'center'
      ctx.fillStyle = p.fg
      ctx.font = '700 34px "Space Grotesk Variable", sans-serif'
      ctx.fillText(String(s.score), SIZE / 2, 54)
    } else if (s.phase === 'idle') {
      text(ctx, p, 'Java  vs  IA', 'toque, clique ou espaço para pular', SIZE / 2 - 42)
    } else {
      text(ctx, p, 'Substituído por IA', 'toque para tentar de novo', SIZE / 2 - 10)
    }
  }

  useEffect(() => {
    if (canvas.current) {
      ctxRef.current = prepareCanvas(canvas.current)
      draw()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLoop((dt) => {
    const s = g.current
    if (s.phase === 'run') {
      s.acc += dt
      while (s.acc >= TICK && s.phase === 'run') {
        s.acc -= TICK
        tick()
      }
    }
    draw()
  }, wrap)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault()
      flap()
    }
  }

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={onKey}
      className="flex flex-col items-center gap-4 outline-none"
      aria-label="Java vs IA. Aperte espaço para pular."
    >
      <div className="flex w-full max-w-[420px] items-end justify-between">
        <Stat label="Pontos" value={score} />
        <GameButton onClick={reset}>Reiniciar</GameButton>
        <Stat label="Recorde" value={best} />
      </div>
      <canvas
        ref={canvas}
        onPointerDown={(e) => {
          e.preventDefault()
          wrap.current?.focus({ preventScroll: true })
          flap()
        }}
        className={canvasClass}
        role="img"
        aria-label="Campo do jogo Java vs IA"
      />
    </div>
  )
}
