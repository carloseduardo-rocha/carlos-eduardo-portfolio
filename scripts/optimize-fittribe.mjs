// Converts the FitTribe app screens (old portfolio repo) to WebP.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'versoes-antigas/v1-github-pages/assets/fittribe'
const OUT = path.resolve('public/fittribe')
const names = ['boasvindas', 'login', 'cadastro', 'onboarding-mapa', 'onboarding-saude', 'sucesso']
fs.mkdirSync(OUT, { recursive: true })
const meta = {}
for (const n of names) {
  const info = await sharp(path.join(SRC, `${n}.png`)).resize({ width: 420, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, `${n}.webp`))
  meta[n] = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) }
  console.log(n, meta[n])
}
fs.writeFileSync('src/data/fittribe-shots.json', JSON.stringify(meta, null, 2))
