// One-off helper: converts the real GestãoCheck screenshots (kept in versoes-antigas/v1-github-pages)
// to WebP and writes their sizes to src/data/gestaocheck-shots.json.
// Usage: node scripts/optimize-gestaocheck.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SRC = 'versoes-antigas/v1-github-pages/assets/gestaocheck'
const OUT = fileURLToPath(new URL('../public/gestaocheck/', import.meta.url))
const MANIFEST = fileURLToPath(new URL('../src/data/gestaocheck-shots.json', import.meta.url))

const names = [
  'inicio-dark', 'inicio-light',
  'estoque-dark', 'estoque-light',
  'cmv-dark', 'cmv-light',
  'cmo-dark', 'cmo-light',
  'cmc-dark', 'cmc-light',
  'relatorio-dark', 'relatorio-light',
  'mobile-inicio',
]

await mkdir(OUT, { recursive: true })
await mkdir(fileURLToPath(new URL('../src/data/', import.meta.url)), { recursive: true })

const manifest = {}
for (const name of names) {
  const img = sharp(`${SRC}/${name}.png`)
  const meta = await img.metadata()
  const maxW = name.startsWith('mobile') ? 700 : 1600
  const out = await img
    .resize({ width: Math.min(meta.width ?? maxW, maxW), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${OUT}${name}.webp`)
  manifest[name] = { w: out.width, h: out.height, kb: Math.round(out.size / 1024) }
  console.log(name.padEnd(16), `${out.width}x${out.height}`, `${Math.round(out.size / 1024)} KB`)
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2))
