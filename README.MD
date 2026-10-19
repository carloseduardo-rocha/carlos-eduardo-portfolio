# Portfólio — Carlos Eduardo

**Site:** [carlos-eduardo-portfolio-red.vercel.app](https://carlos-eduardo-portfolio-red.vercel.app) · **GitHub:** [carloseduardo-rocha](https://github.com/carloseduardo-rocha) · **LinkedIn:** [carlos-eduardo-rocha-da-silva](https://www.linkedin.com/in/carlos-eduardo-rocha-da-silva-408087230/)

Portfólio de Carlos Eduardo, desenvolvedor Full Stack em Fortaleza. Uma abertura em "portal" (partículas em WebGL que formam o logo CR
e se abrem ao rolar a página) leva às seções: Hero, Trajetória e tecnologias, GestãoCheck, Engrenagem Tech, outros projetos,
formação e certificados, minigames e contato. Tema escuro e claro, mobile first.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion (interface) · GSAP (scroll) · Three.js (partículas).

## Histórico: este projeto já passou por isso

Este repositório começou como o projeto do programa **Discover da Rocketseat** e foi crescendo junto comigo.

| Versão | O que era | Onde está |
| --- | --- | --- |
| **v1** (tag `v1.0.0`) | Site estático em HTML, CSS e JavaScript puro, publicado no GitHub Pages. Tinha o case-study do GestãoCheck, cards de projetos com pré-visualização, minigames e carrossel de conquistas. | Guardado inteiro em [`versoes-antigas/v1-github-pages`](versoes-antigas/v1-github-pages) |
| **v2** (tag `v2.0.0`, atual) | Reconstrução completa em Vite + React + TypeScript, com a abertura em portal, seções novas (Engrenagem Tech, tecnologias, formação com certificados em PDF), 6 minigames e deploy na Vercel. | Raiz deste repositório |

A v1 foi mantida como referência e não recebe mais alterações. Para vê-la, abra `versoes-antigas/v1-github-pages/index.html` com o Live Server.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # tsc + build de produção em dist/
npm run preview  # serve o build com os mesmos headers de segurança da Vercel
```

## Publicar na Vercel

1. Na Vercel: **Add New → Project** e escolha este repositório. O preset Vite é detectado sozinho
   (build `npm run build`, saída `dist`). Não precisa configurar mais nada.
2. A URL pública entra sozinha em `og:url`, `og:image`, `canonical`, `sitemap.xml` e `robots.txt`
   (via `VERCEL_PROJECT_PRODUCTION_URL`). Com domínio próprio, crie a variável `SITE_URL` (ex.: `https://meudominio.com`) e faça um novo deploy.
3. Headers de segurança (CSP, HSTS etc.) e cache ficam em `vercel.json`.

## Estrutura

| O quê | Onde |
| --- | --- |
| Textos e dados de cada seção | `src/components/*.tsx` |
| Logo das partículas | `src/lib/logo.ts` |
| Fotos de perfil (escuro / claro) | `public/photos/carlos.jpg`, `public/photos/carlos-light.jpg` |
| Ilustrações (Sobre / Contato) | `public/art/` |
| Currículo | `public/Curriculo_Carlos_Eduardo_Dev.pdf` |
| Certificados (PDF) | `public/certificados/` |
| Jogos | `src/components/games/` |
| Scripts de imagem (WebP, OG) | `scripts/` |
| Versão antiga do site | `versoes-antigas/v1-github-pages/` |

A data do rodapé ("Última atualização") é a data do build.
