const SIZE = 512
const K = SIZE / 720 // the drawing was designed at 720px
export const LOGO_WORLD_WIDTH = 6

/** Make sure the display font is ready before we rasterise the logo. */
export async function loadLogoFont(): Promise<void> {
  try {
    await document.fonts.load('700 120px "Space Grotesk Variable"')
    await document.fonts.ready
  } catch {
    /* fall back to whatever font is available */
  }
}

/**
 * Rasterises the logo (a dotted ring + "CR") on an offscreen canvas and returns
 * `count` random points that sit on the ink. Swap the drawing code to change
 * the logo — the rest of the pipeline doesn't care what the shape is.
 */
export function sampleLogo(count: number): {
  positions: Float32Array
  radial: Float32Array
} {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const c = SIZE / 2

  // ring + ticks → red channel
  ctx.strokeStyle = '#f00'
  ctx.lineWidth = 14 * K
  ctx.beginPath()
  ctx.arc(c, c, SIZE * 0.4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 7 * K
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const long = i % 6 === 0
    const r0 = SIZE * 0.445
    const r1 = SIZE * (long ? 0.495 : 0.468)
    ctx.beginPath()
    ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0)
    ctx.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1)
    ctx.stroke()
  }

  // letters → green channel
  ctx.fillStyle = '#0f0'
  ctx.font = `700 ${SIZE * 0.4}px "Space Grotesk Variable", Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('CR', c, c + SIZE * 0.02)

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
  const ring: number[] = []
  const text: number[] = []
  for (let i = 0; i < SIZE * SIZE; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    if (r > 128 && r > g) ring.push(i)
    else if (g > 128) text.push(i)
  }

  const positions = new Float32Array(count * 3)
  const radial = new Float32Array(count)
  const ringShare = 0.42
  for (let n = 0; n < count; n++) {
    const pool = n < count * ringShare && ring.length ? ring : text.length ? text : ring
    const idx = pool[(Math.random() * pool.length) | 0]
    const px = (idx % SIZE) + Math.random() - 0.5
    const py = Math.floor(idx / SIZE) + Math.random() - 0.5
    const x = (px / SIZE - 0.5) * LOGO_WORLD_WIDTH
    const y = -(py / SIZE - 0.5) * LOGO_WORLD_WIDTH
    positions[n * 3] = x
    positions[n * 3 + 1] = y
    positions[n * 3 + 2] = (Math.random() - 0.5) * 0.14
    radial[n] = Math.min(1, Math.hypot(x, y) / (LOGO_WORLD_WIDTH * 0.5))
  }
  return { positions, radial }
}
