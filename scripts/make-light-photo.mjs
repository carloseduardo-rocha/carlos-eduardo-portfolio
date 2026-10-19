// Light-theme profile photo: crops the round avatar-light.png (white shirt) inside its grey ring and upscales it.
import sharp from 'sharp'
const SRC = 'versoes-antigas/v1-github-pages/assets/brand/avatar-light.png'
const m = await sharp(SRC).metadata()
console.log(m.width, m.height, m.hasAlpha)
const inset = 12
const size = Math.min(m.width, m.height) - inset * 2
await sharp(SRC)
  .flatten({ background: '#e9eef3' })
  .extract({ left: Math.round((m.width - size) / 2), top: Math.round((m.height - size) / 2), width: size, height: size })
  .resize(720, 720, { kernel: 'lanczos3' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/photos/carlos-light.jpg')
console.log('ok')
