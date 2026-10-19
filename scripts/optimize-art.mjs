// One-off: the originals were not kept in the repo (the WebP results live in public/art).
// Converts the two illustrations the author sent (desk selfie and floating 3D head) to WebP for public/art/.
import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'C:/Users/USER/AppData/Local/Temp/claude/C--Users-USER-OneDrive--rea-de-Trabalho-Projetos-Projeto-RocketSeat/729007b8-9cfd-44de-a67b-703c450acf58/images'
fs.mkdirSync('public/art', { recursive: true })
const jobs = [
  ['3.webp', 'desk.webp', 1100],
  ['2.webp', 'head.webp', 820],
]
const meta = {}
for (const [from, to, width] of jobs) {
  const info = await sharp(`${SRC}/${from}`).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/art/${to}`)
  meta[to.replace('.webp', '')] = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) }
}
fs.writeFileSync('src/data/art-shots.json', JSON.stringify(meta, null, 2))
console.log(meta)
