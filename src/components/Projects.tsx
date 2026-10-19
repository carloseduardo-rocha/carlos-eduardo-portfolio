import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Chip } from '@/components/Chip'
import { Modal } from '@/components/Modal'
import { SectionHeading } from '@/components/SectionHeading'
import { Tilt } from '@/components/Tilt'
import fit from '@/data/fittribe-shots.json'

/** Boxes in a column; a pulse of light runs through them one after another. */
function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="flex h-full flex-col justify-center gap-2.5 px-6" aria-hidden="true">
      {steps.map((s, i) => (
        <li
          key={s}
          style={{ '--i': i } as CSSProperties}
          className="flow-step rounded-lg border border-line bg-bg/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-fg/90"
        >
          <span className="mr-3 text-accent">{String(i + 1).padStart(2, '0')}</span>
          {s}
        </li>
      ))}
    </ol>
  )
}

const WHITE: Record<string, string> = { '♜': '♖', '♞': '♘', '♝': '♗', '♛': '♕', '♚': '♔' }
const BACK = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜']

function ChessBoard() {
  const pieces: Record<number, string> = {}
  BACK.forEach((p, i) => {
    pieces[i] = p
    pieces[56 + i] = WHITE[p]
    pieces[8 + i] = '♟'
    pieces[48 + i] = '♙'
  })
  return (
    <div
      className="mx-auto grid aspect-square h-full max-h-full grid-cols-8 overflow-hidden rounded-lg border border-line"
      aria-hidden="true"
    >
      {Array.from({ length: 64 }, (_, i) => {
        const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1
        return (
          <span
            key={i}
            className={`grid place-items-center text-[clamp(0.7rem,1.8vw,1.2rem)] leading-none ${
              dark ? 'bg-accent/20' : 'bg-bg/60'
            } ${i < 16 ? 'text-fg' : 'text-accent'} ${i === 52 ? 'pawn-e2' : ''}`}
          >
            {pieces[i]}
          </span>
        )
      })}
    </div>
  )
}

const FIT = ['boasvindas', 'login', 'onboarding-mapa', 'cadastro'] as const

function PhoneCycle() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((v) => (v + 1) % FIT.length), 2600)
    return () => clearInterval(id)
  }, [reduced])
  return (
    <div className="mx-auto h-full w-auto max-w-full" style={{ aspectRatio: '420 / 910' }}>
      <div className="relative h-full overflow-hidden rounded-[1.4rem] border-[3px] border-fg/20 bg-black shadow-[0_18px_40px_-16px_rgb(0_0_0/0.7)]">
        {FIT.map((n, k) => (
          <img
            key={n}
            src={`/fittribe/${n}.webp`}
            alt=""
            aria-hidden="true"
            width={fit[n].w}
            height={fit[n].h}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${k === i ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  )
}

const FIT_GALLERY: { n: keyof typeof fit; label: string }[] = [
  { n: 'boasvindas', label: 'Boas-vindas' },
  { n: 'login', label: 'Login' },
  { n: 'cadastro', label: 'Cadastro' },
  { n: 'onboarding-mapa', label: 'Mapa' },
  { n: 'onboarding-saude', label: 'Saúde' },
  { n: 'sucesso', label: 'Sucesso' },
]

type Project = {
  id: string
  title: string
  period: string
  text: string
  details: string[]
  stack: string[]
  href: string
  visual: ReactNode
  note?: string
  gallery?: boolean
}

const projects: Project[] = [
  {
    id: 'spring',
    title: 'API REST com Spring Boot',
    period: 'nov — dez/2025',
    text: 'API REST de e-commerce com usuários, produtos, pedidos e pagamentos, em camadas e com banco relacional.',
    details: [
      'Arquitetura em camadas: Controller, Service e Repository.',
      'Usuários, produtos, pedidos e pagamentos ligados por relacionamentos JPA/Hibernate.',
      'PostgreSQL como banco de dados.',
      'Tratamento global de exceções.',
      'Endpoints testados no Postman.',
    ],
    stack: ['Java', 'Spring Boot', 'JPA / Hibernate', 'PostgreSQL'],
    href: 'https://github.com/carloseduardo-rocha/workshop-springboot4-jpa',
    visual: <Flow steps={['Controller', 'Service', 'Repository', 'Entity']} />,
  },
  {
    id: 'agent',
    title: 'Agente de IA para Service Desk',
    period: 'set/2025',
    text: 'Triagem de chamados com Google Gemini e RAG: resolve, pede mais informação ou abre chamado.',
    details: [
      'Classifica cada pedido em AUTO_RESOLVER, PEDIR_INFO ou ABRIR_CHAMADO.',
      'Usa a API do Google Gemini para entender o pedido.',
      'RAG: a resposta vem de documentos reais, não só do modelo.',
      'Construído na Imersão Dev: Agentes de IA, da Alura com o Google.',
    ],
    stack: ['Python', 'Gemini API', 'RAG'],
    href: 'https://github.com/carloseduardo-rocha/Alura-IA-Agents',
    visual: <Flow steps={['Pergunta', 'Classifica', 'Busca (RAG)', 'Resposta']} />,
  },
  {
    id: 'chess',
    title: 'Chess System',
    period: 'out — nov/2025',
    text: 'Xadrez completo no console, com as regras oficiais. Projeto de orientação a objetos em Java.',
    details: [
      'Roque, en passant, promoção de peão e xeque-mate.',
      'Tabuleiro desenhado no console.',
      'Modelagem orientada a objetos do jogo inteiro.',
      'Feito durante o curso Java COMPLETO: POO + Projetos.',
    ],
    stack: ['Java', 'POO', 'Lógica de jogo'],
    href: 'https://github.com/carloseduardo-rocha/Chess-System-Java',
    visual: <ChessBoard />,
  },
  {
    id: 'fittribe',
    title: 'FitTribe',
    period: 'mar/2025 — em retomada',
    text: 'App mobile para descobrir e organizar eventos esportivos de corrida e ciclismo, com mapa e login.',
    details: [
      'App mobile em React Native com Expo.',
      'Mapa interativo para achar eventos e autenticação de usuários.',
      'Back-end em Node.js com SQLite.',
      'Telas desenhadas no Figma antes de codar.',
      'Projeto do Senac, feito em equipe com Nator Junior e Antonio.',
      'Em retomada: vou voltar a desenvolver e evoluir o app.',
    ],
    stack: ['Node.js', 'React Native / Expo', 'SQLite', 'Figma'],
    href: 'https://github.com/carloseduardo-rocha/FitTribe-App_Mobile',
    visual: <PhoneCycle />,
    gallery: true,
  },
]

function Details({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-5 py-3 backdrop-blur">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">{p.period}</p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="cursor-pointer rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Fechar
        </button>
      </div>
      <div className="p-5 md:p-8">
        <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">{p.title}</h3>
        <p className="mt-3 text-muted">{p.text}</p>

        {p.gallery ? (
          <ul className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6" aria-label="Telas do app">
            {FIT_GALLERY.map((g) => (
              <li key={g.n}>
                <figure>
                  <img
                    src={`/fittribe/${g.n}.webp`}
                    alt={`Tela ${g.label} do FitTribe`}
                    width={fit[g.n].w}
                    height={fit[g.n].h}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-xl border border-line bg-black"
                  />
                  <figcaption className="mt-1 text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                    {g.label}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 h-64 overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_70%)] py-4">
            {p.visual}
          </div>
        )}

        <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-accent">O que tem dentro</h4>
        <ul className="mt-3 space-y-2.5">
          {p.details.map((d) => (
            <li key={d} className="flex gap-3 text-sm leading-relaxed text-muted md:text-base">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
          {p.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </ul>

        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-[0_0_28px_-6px_var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Ver no GitHub →
        </a>
      </div>
    </div>
  )
}

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section id="projetos" aria-labelledby="proj-title" className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10">
      <SectionHeading n="05" id="proj-title" title="Outros projetos" />
      <p className="mt-4 max-w-2xl text-muted md:text-lg">
        Projetos de estudo e de faculdade que sustentam o que uso no dia a dia. Clique em um deles para ver o
        que tem dentro e abrir o código no GitHub.
      </p>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <m.li
            key={p.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex"
          >
            <Tilt className="w-full">
              <button
                type="button"
                onClick={() => setOpen(p)}
                aria-haspopup="dialog"
                className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-bg/55 text-left backdrop-blur-md transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div className="h-56 w-full border-b border-line bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_70%)] py-4">
                  {p.visual}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">{p.period}</p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Stack de ${p.title}`}>
                    {p.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </ul>
                  <span className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    Ver detalhes →
                  </span>
                </div>
              </button>
            </Tilt>
          </m.li>
        ))}
      </ul>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open ? `Detalhes: ${open.title}` : 'Detalhes'}>
        {open && <Details p={open} onClose={() => setOpen(null)} />}
      </Modal>
    </section>
  )
}
