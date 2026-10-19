// Generates public/og-image.png (1200x630) from an inline SVG.
import sharp from 'sharp'

const ticks = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2
  const r0 = 168
  const r1 = i % 6 === 0 ? 184 : 176
  return `<line x1="${Math.cos(a) * r0}" y1="${Math.sin(a) * r0}" x2="${Math.cos(a) * r1}" y2="${Math.sin(a) * r1}" stroke="#22e6ff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>`
}).join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="25%" cy="50%" r="70%">
      <stop offset="0" stop-color="#0a2a36"/>
      <stop offset="1" stop-color="#04070d"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(300 315)">
    <circle r="158" fill="none" stroke="#22e6ff" stroke-width="1.5" opacity="0.5"/>
    ${ticks}
    <text y="34" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="112" fill="#e9f2ff" letter-spacing="4">CE</text>
  </g>
  <g font-family="Arial, sans-serif" fill="#e9f2ff">
    <text x="600" y="290" font-size="72" font-weight="700">Carlos Eduardo</text>
    <text x="600" y="352" font-size="34" fill="#22e6ff">Desenvolvedor Back-End</text>
    <text x="600" y="412" font-size="26" fill="#8fa3bf">Python · Flask · PostgreSQL · Java</text>
    <text x="600" y="456" font-size="26" fill="#8fa3bf">Fortaleza, CE</text>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('ok')
