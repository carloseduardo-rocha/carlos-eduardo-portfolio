import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Public URL of the site, used for og:url / og:image / canonical / sitemap.
 * Set SITE_URL yourself, or let Vercel provide it (production domain). Empty locally.
 */
function siteUrl() {
  const raw = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return raw.replace(/\/+$/, '')
}

function siteMeta(): Plugin {
  const url = siteUrl()
  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'pre',
      // without a known URL (local dev) the absolute-URL tags are dropped instead of pointing at "/"
      handler: (html) =>
        url
          ? html.replaceAll('__SITE_URL__', url)
          : html
              .split('\n')
              .filter((line) => !line.includes('__SITE_URL__'))
              .join('\n'),
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${url ? `\nSitemap: ${url}/sitemap.xml\n` : ''}`,
      })
      if (url) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
        })
      }
    },
  }
}

// `vite preview` serves the same security headers as production (from vercel.json), so a CSP break shows up locally.
function previewHeaders() {
  const cfg = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }
  const all = cfg.headers.find((h) => h.source === '/(.*)')?.headers ?? []
  return Object.fromEntries(all.map((h) => [h.key, h.value]))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  // shown in the footer as "Última atualização"
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString()) },
  preview: { headers: previewHeaders() },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
