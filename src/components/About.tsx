import * as m from 'motion/react-m'
import { SectionHeading } from '@/components/SectionHeading'
import { Skills } from '@/components/Skills'
import { DeskArt } from '@/components/Art'

/** Every line below comes from "Minha trajetória completa" (and the live Engrenagem Tech site). */
const steps = [
  {
    when: 'set/2024 — ago/2025',
    org: 'Alares Internet',
    role: 'Aprendiz em Analista de Projetos',
    text: 'Projetei a rede FTTH completa de uma área no OZmap, da OLT até a casa do cliente.',
    tag: 'Redes · FTTH',
  },
  {
    when: 'dez/2025 — mar/2026',
    org: 'Lanlink Informática',
    role: 'Suporte técnico N1',
    text: 'Mais de 700 chamados em 3 meses, em 3 contratos, conforme SLA e seguindo ITIL 4.',
    tag: 'Suporte · ITIL 4',
  },
  {
    when: 'mar/2026 — hoje',
    org: 'GestãoCheck',
    role: 'Desenvolvedor back-end (freelancer)',
    text: 'Chamado para construir o sistema junto com os fundadores: levantamento de requisitos, arquitetura e a base do código. Hoje em uso por clientes reais.',
    tag: 'Python · Flask · PostgreSQL',
    current: true,
  },
  {
    when: 'out/2026',
    org: 'Engrenagem Tech',
    role: 'Minha empresa',
    text: 'Sites, sistemas e automações sob medida para negócios, direto de Fortaleza.',
    tag: 'Empresa própria',
  },
]

export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div>
          <SectionHeading n="02" id="sobre-title" title="Minha trajetória" />
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Comecei em redes e suporte e hoje desenvolvo sistemas completos, do back-end à interface. Cada etapa me deu a visão de quem usa e de quem opera o sistema.
          </p>
        </div>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <DeskArt className="w-full max-w-sm lg:w-[22rem]" />
        </m.div>
      </div>

      <ol className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-5">
        {/* the route line: vertical on mobile, horizontal on desktop */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-accent/70 via-line to-line md:inset-x-0 md:bottom-auto md:left-0 md:top-[7px] md:h-px md:w-auto md:bg-gradient-to-r"
        />
        {steps.map((s, i) => (
          <m.li
            key={s.org}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-9 md:pl-0 md:pt-10"
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-accent md:top-0 ${
                s.current ? 'bg-accent shadow-[0_0_16px_var(--color-accent)]' : 'bg-bg'
              }`}
            />
            <div className="h-full rounded-2xl border border-line bg-bg/55 p-5 backdrop-blur-md transition-colors hover:border-accent/60">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                {s.when}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">{s.org}</h3>
              <p className="mt-1 text-sm font-medium text-fg/80">{s.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
              <p className="mt-4 inline-block rounded-full border border-dashed border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                {s.tag}
              </p>
            </div>
          </m.li>
        ))}
      </ol>

      <Skills />
    </section>
  )
}
