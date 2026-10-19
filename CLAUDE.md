# Portfólio do Carlos Eduardo (v2)

Este repositório (`carlos-eduardo-portfolio` (antes `Projeto-RocketSeat`), GitHub: carloseduardo-rocha) é o portfólio dele. Nasceu no programa Discover da Rocketseat
(v1: HTML/CSS/JS puro no GitHub Pages) e foi reconstruído em Vite + React (v2, deploy na Vercel).
A v1 está guardada **intacta** em `versoes-antigas/v1-github-pages/` (abre com Live Server; tem o CLAUDE.md e o README antigos).
A v1 NÃO leva hotfix: tudo se corrige na v2. Tags: `v1.0.0` = último commit da v1 (d59237a), `v2.0.0` = a reconstrução.
Aviso: o repo fica no OneDrive (já corrompeu o .git uma vez). `node_modules` aqui sincroniza milhares de arquivos; preferir pausar o OneDrive no `npm install`.

## Estrutura
```
src/ public/ scripts/ index.html vite.config.ts vercel.json   # site v2
versoes-antigas/v1-github-pages/                                # site v1 (referência; os assets antigos são fonte p/ scripts/)
```

## Regras
- **Nunca rode `git commit` nem `git push`.** Entregue o texto do commit para o Carlos rodar.
- Nada vai pro ar (Vercel/GitHub Pages) sem o "ok" dele.
- Só afirme o que está em `Currículos\Minha_trajetoria_completa.md` (fonte da verdade). GestãoCheck:
  **desenvolvedor back-end freelancer**, nunca "cofundador" nem "tech lead". Números: "16+ módulos",
  "189+ testes". Contador zerado não vai pro ar. Inglês = "intermediário".
- Antes de usar uma biblioteca, consultar a doc (Context7). Não trocar a stack sem perguntar.

## Stack
Vite + React 19 + TypeScript + Tailwind v4 + Motion (UI) + GSAP (scroll, ScrollTrigger/Observer, carregado sob demanda)
+ Three.js (partículas, carregado sob demanda). shadcn/ui entra quando a 1ª seção real precisar.
Fontes: Space Grotesk (display), Inter (texto), JetBrains Mono (rótulos) — só subset latin (`src/fonts.css`).

## Como o portal funciona
`src/hooks/usePortalScroll.ts` (GSAP) escreve `portal.intro/outro/target` (`src/lib/portal.ts`);
`src/lib/particles.ts` (Three) lê `portal.target` e mistura logo ↔ campo de partículas no shader.
- `#intro` (sticky, ~170svh de scroll) abre a logo até o hero. `#outro` fecha de volta.
- No fim da página, wheel/touch extra (Observer) enche a barra `--loop` e reinicia no topo (véu curto esconde o salto).
- Scroll é nativo (teclado, barra e momentum do iOS funcionam). "Pular intro" existe.
- `prefers-reduced-motion`, `Save-Data` e falha de WebGL → página normal (`html[data-gl="off"]`, ver `index.css`).
- Logo = `drawing` em `src/lib/logo.ts` (anel + "CR"); trocar o desenho troca a logo das partículas.

## Comandos
`npm run dev` (Vite) · `npm run build` (tsc + vite build) · `npm run preview`

## Decisões já tomadas
- **Cargo = Desenvolvedor Full Stack** (ele disse "hoje sou fullstack", 19/10/2026; mantém foco em back-end). No GestãoCheck o papel
  continua "desenvolvedor back-end (freelancer)" porque é o que ele faz lá. Hero tem o bloco estilo terminal (whoami / stack / status).
- Logo das partículas = "CR" (era "CE", mas parecia Ceará) (não usar a engrenagem). Fotos: escuro = `public/photos/carlos.jpg` (camisa azul-marinho), claro =
  `public/photos/carlos-light.jpg` (camisa branca, vem do avatar-light.png antigo; troca por CSS em `.photo-dark/.photo-light`).
- Avatar 3D/terminal/SVG foram removidos. Ele mandou 2 ilustrações próprias (19/10/2026): `public/art/desk.webp` (selfie ilustrada no setup) vai em **Sobre**
  (`DeskArt` em `Art.tsx`, com tilt) e `public/art/head.webp` (cabeça 3D com céu) vai em **Contato** (`HeadArt`, flutuando no anel). Fotos reais só no hero.
  Fonte das imagens: `scripts/optimize-art.mjs`. Não mandar foto dele pra serviço externo (ex.: remover fundo).
- Currículo = `public/Curriculo_Carlos_Eduardo_Dev.pdf`. GestãoCheck = https://gestaocheck.tech/ (fora do ar por ora, manter o link).
- LinkedIn = linkedin.com/in/carlos-eduardo-rocha-da-silva-408087230/. **Sem número de clientes** (só "tem clientes").
- ADS = fev/2023 — jul/2025 (ele confirmou). Pós Unopar = dez/2025 — out/2026.
- O PDF "Domine as 10 Melhores Ferramentas de IA" fica de fora. O site antigo NÃO leva hotfix; tudo se corrige aqui.
- Nomes dos fundadores (Antonio/Jarbas) não aparecem no site.
- Janelas de print têm as 3 bolinhas coloridas (#ff5f57 / #febc2e / #28c840), não trocar por cinza.
- Projetos (seção 5): card com tilt 3D (`Tilt.tsx`), diagrama com pulso, clique abre `Modal.tsx` com detalhes + GitHub. Só afirmar o que está nas fontes.
- Jogos (6): Snake (rostinho, estrela bônus, acelera), Jogo da Velha (CPU / CPU difícil minimax / amigo), Pong (3 níveis), Java vs IA, Memória Dev, 2048.
- Skills (3 grupos aprovados por ele) ficam em `Skills.tsx`, dentro de Sobre. Só tem descrição onde há fonte.

## Deploy (Vercel) — pronto, ele só faz o push
`vercel.json` (CSP sem scripts inline, HSTS, cache), `vite.config.ts` (plugin site-meta: og:url/canonical/sitemap/robots a partir de
`SITE_URL` ou `VERCEL_PROJECT_PRODUCTION_URL`), scripts inline viraram `public/theme-init.js` e `src/boot.ts`. `npm run preview` aplica os mesmos headers
(testado: sem violação de CSP, PDF em iframe funciona). README explica o passo a passo. **Nunca** commit/push: só entregar o texto.

## Estado
8 seções + skills prontas e testadas em 390/1440, claro/escuro. Falta: QA final com Lighthouse 90+ (mobile ~66 por causa do LCP/WebGL: plano
= prerender/SSG + init do WebGL em fatias), redirect do GitHub Pages antigo só depois do deploy aprovado.
