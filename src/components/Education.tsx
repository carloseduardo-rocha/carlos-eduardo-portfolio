import { useEffect, useRef, useState } from 'react'
import * as m from 'motion/react-m'
import { SectionHeading } from '@/components/SectionHeading'

type Item = {
  title: string
  issuer: string
  when: string
  text: string
  pdf?: string
}

const degrees: Item[] = [
  {
    title: 'Análise e Desenvolvimento de Sistemas',
    issuer: 'Centro Universitário Senac-CE · Graduação tecnológica',
    when: 'fev/2023 — jul/2025 · concluída',
    text: 'Formação tecnológica em desenvolvimento de sistemas. Daqui saíram projetos como o app FitTribe e o Gerenciador de Contatos em Java.',
    pdf: '/certificados/diploma-ads-senac.pdf',
  },
  {
    title: 'Computação Forense e Perícia Digital',
    issuer: 'Unopar (EAD) · Pós-graduação',
    when: 'dez/2025 — out/2026 · em conclusão',
    text: 'Área de investigação e perícia em dados digitais. Conclusão prevista para outubro de 2026.',
  },
]

const courses: Item[] = [
  {
    title: 'Java COMPLETO: POO + Projetos',
    issuer: 'Udemy · Nelio Alves',
    when: 'jan/2026 · 54h',
    text: 'Orientação a objetos em Java. Base do Chess System e da API Spring Boot.',
    pdf: '/certificados/java-completo-udemy.pdf',
  },
  {
    title: 'Docker: do Zero ao Avançado',
    issuer: 'Udemy · André Iacono',
    when: 'ago/2026 · 5,5h',
    text: 'Imagens, containers, volumes, redes e Compose. Uso no deploy do GestãoCheck.',
    pdf: '/certificados/docker-zero-avancado-udemy.pdf',
  },
  {
    title: 'Imersão Dev: Agentes de IA',
    issuer: 'Alura com Google',
    when: 'set/2025 · 5h',
    text: 'Agentes com LLMs, chamada de ferramentas e RAG. Origem do agente de Service Desk.',
    pdf: '/certificados/imersao-agentes-ia-alura.pdf',
  },
  {
    title: 'Automação Inteligente com N8N',
    issuer: 'Udemy · André Iacono',
    when: 'ago/2026 · 2,5h',
    text: 'Fluxos de automação low-code integrando APIs, webhooks e IA.',
    pdf: '/certificados/n8n-automacao-udemy.pdf',
  },
  {
    title: 'Discover',
    issuer: 'Rocketseat',
    when: 'abr/2025 · 12h',
    text: 'Fundamentos de programação web: HTML, CSS, JavaScript, Git e GitHub.',
    pdf: '/certificados/discover-rocketseat.pdf',
  },
  {
    title: 'ISO/IEC 20000 Foundation',
    issuer: 'Udemy · Alex Villaverde',
    when: 'ago/2025 · 6,5h',
    text: 'Fundamentos de gestão de serviços de TI.',
    pdf: '/certificados/iso20000-udemy.pdf',
  },
  {
    title: 'Introdução à IA: Inteligência Artificial na Prática',
    issuer: 'Senac-CE',
    when: 'dez/2024',
    text: 'Fundamentos de inteligência artificial aplicada.',
    pdf: '/certificados/introducao-ia-senac.pdf',
  },
]

const VISIBLE = 4

function CertDialog({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (item && !d.open) d.showModal()
    if (!item && d.open) d.close()
  }, [item])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label={item ? `Certificado: ${item.title}` : undefined}
      className="m-auto h-[min(88svh,900px)] w-[min(94vw,960px)] max-w-none rounded-2xl border border-line bg-bg p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {item?.pdf && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="truncate font-display text-sm font-semibold md:text-base">{item.title}</p>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={item.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent/60 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Abrir em nova aba
              </a>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="cursor-pointer rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Fechar
              </button>
            </div>
          </div>
          <iframe src={item.pdf} title={`PDF: ${item.title}`} className="min-h-0 flex-1 bg-white" />
        </div>
      )}
    </dialog>
  )
}

function Card({ item, onOpen, large = false }: { item: Item; onOpen: (i: Item) => void; large?: boolean }) {
  const body = (
    <>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent">{item.when}</p>
      <h4 className={`mt-2 font-display font-bold leading-snug ${large ? 'text-xl' : 'text-base'}`}>{item.title}</h4>
      <p className="mt-1 text-xs font-medium text-fg/75">{item.issuer}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
      {item.pdf && (
        <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent">Ver certificado →</p>
      )}
    </>
  )
  const base = 'h-full w-full rounded-2xl border border-line bg-bg/75 md:bg-bg/55 p-5 text-left md:backdrop-blur-md'
  return item.pdf ? (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${item.title}: abrir certificado`}
      className={`${base} cursor-pointer transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {body}
    </button>
  ) : (
    <div className={base}>{body}</div>
  )
}

export function Education() {
  const [open, setOpen] = useState<Item | null>(null)
  const [all, setAll] = useState(false)
  const shown = all ? courses : courses.slice(0, VISIBLE)

  return (
    <section id="formacao" aria-labelledby="edu-title" className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10">
      <SectionHeading n="06" id="edu-title" title="Formação e certificados" />

      <m.ul
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 grid gap-4 md:grid-cols-2"
        aria-label="Formação acadêmica"
      >
        {degrees.map((d) => (
          <li key={d.title}>
            <Card item={d} onOpen={setOpen} large />
          </li>
        ))}
      </m.ul>

      <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.22em] text-accent">Cursos e imersões</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Cursos e certificados">
        {shown.map((c, i) => (
          <m.li
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6%' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card item={c} onOpen={setOpen} />
          </m.li>
        ))}
      </ul>

      {courses.length > VISIBLE && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-6 cursor-pointer rounded-full border border-line px-5 py-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent/60 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {all ? 'Ver menos' : `Ver mais ${courses.length - VISIBLE}`}
        </button>
      )}

      <CertDialog item={open} onClose={() => setOpen(null)} />
    </section>
  )
}
