// One-off: reads prints from the author's local Engrenagem Tech folder (outside this repo).
// Converts the Engrenagem Tech prints (from the author's local folder) to WebP and writes their sizes.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'C:/Users/USER/OneDrive/Área de Trabalho/Projetos/Engrenagem Tech/linkedin-prints'
const OUT = path.resolve('public/engrenagem')
const files = {
  'hero-desktop': ['desktop-01-hero.png', 1400],
  'demos-desktop': ['desktop-03-demos.png', 1400],
  'hero-mobile': ['celular-01-hero.png', 520],
  'dom-navalha': ['demo-dom-navalha.png', 1000],
  'sorrir-aldeota': ['demo-sorrir-aldeota.png', 1000],
  'brasa-smash': ['demo-brasa-smash.png', 1000],
  'studio-jasmim': ['demo-studio-jasmim.png', 1000],
  'casa-forte': ['demo-casa-forte.png', 1000],
  'auto-center-parangaba': ['demo-auto-center-parangaba.png', 1000],
}
fs.mkdirSync(OUT, { recursive: true })
const meta = {}
for (const [name, [file, width]] of Object.entries(files)) {
  const out = path.join(OUT, `${name}.webp`)
  const info = await sharp(path.join(SRC, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  meta[name] = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) }
  console.log(name, meta[name])
}
fs.writeFileSync('src/data/engrenagem-shots.json', JSON.stringify(meta, null, 2))
