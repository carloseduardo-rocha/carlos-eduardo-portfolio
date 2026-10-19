import * as m from 'motion/react-m'
import { Chip } from '@/components/Chip'
import { SectionHeading } from '@/components/SectionHeading'
import shots from '@/data/engrenagem-shots.json'

const SITE = 'https://engrenagem-tech.vercel.app/'
const LINKEDIN = 'https://www.linkedin.com/company/engrenagem-tech/'

const offers = [
  { title: 'Sites', text: 'Landing page, site institucional e site com painel para o dono mudar preços e promoções.' },
  { title: 'Sistemas', text: 'Do cadastro simples ao sistema de gestão com módulos que conversam entre si.' },
  { title: 'Automações', text: 'Integração entre o site, o sistema e o WhatsApp do negócio, sem retrabalho.' },
]

const demos = [
  { slug: 'barbearia', img: 'dom-navalha', name: 'Barbearia Dom Navalha', kind: 'Site' },
  { slug: 'clinica-odontologica', img: 'sorrir-aldeota', name: 'Clínica Sorrir Aldeota', kind: 'Site' },
  { slug: 'hamburgueria', img: 'brasa-smash', name: 'Brasa Smash', kind: 'Site' },
  { slug: 'salao-de-beleza', img: 'studio-jasmim', name: 'Studio Jasmim', kind: 'Sistema' },
  { slug: 'material-de-construcao', img: 'casa-forte', name: 'Casa Forte Materiais', kind: 'Sistema' },
  { slug: 'oficina-mecanica', img: 'auto-center-parangaba', name: 'Auto Center Parangaba', kind: 'Sistema' },
] as const

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
}

function Dots() {
  return (
    <span aria-hidden="true" className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </span>
  )
}

export function Engrenagem() {
  const hero = shots['hero-desktop']
  const phone = shots['hero-mobile']

  return (
    <section id="engrenagem" aria-labelledby="eng-title" className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10">
      <SectionHeading n="04" id="eng-title" title="Minha empresa" />

      <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        <m.div {...reveal}>
          <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            Engrenagem Tech · Fortaleza
          </p>
          <p className="mt-5 text-lg leading-relaxed text-fg/90">
            A Engrenagem Tech é a empresa que abri para fazer sites, sistemas e automações sob medida
            para negócios locais. Eu cuido do projeto inteiro: conversa com o dono, desenho da solução,
            código e publicação.
          </p>

          <ul className="mt-8 grid gap-3">
            {offers.map((o) => (
              <li key={o.title} className="rounded-2xl border border-line bg-bg/55 p-5 backdrop-blur-md">
                <h3 className="font-display text-lg font-bold">{o.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{o.text}</p>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack do site da empresa">
            {['React', 'TypeScript', 'Vite', 'Tailwind', 'Motion', 'Vercel'].map((s) => (
              <Chip key={s} dashed>
                {s}
              </Chip>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <m.a
              href={SITE}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-[0_0_28px_-6px_var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Conhecer a Engrenagem →
            </m.a>
            <m.a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Página no LinkedIn
            </m.a>
          </div>
        </m.div>

        <m.div {...reveal} className="relative self-start pb-8">
          <div className="overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]">
            <div className="flex items-center gap-3 border-b border-line bg-bg/80 px-4 py-3">
              <Dots />
              <span className="truncate font-mono text-[0.68rem] text-muted">engrenagem-tech.vercel.app</span>
            </div>
            <img
              src="/engrenagem/hero-desktop.webp"
              alt="Página inicial do site da Engrenagem Tech, em tema escuro com detalhes em ciano."
              width={hero.w}
              height={hero.h}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>
          <figure className="absolute -bottom-0 right-3 w-[24%] overflow-hidden rounded-xl border border-line bg-bg shadow-[0_18px_40px_-14px_rgb(0_0_0/0.6)] md:-right-3">
            <img
              src="/engrenagem/hero-mobile.webp"
              alt="Site da Engrenagem Tech no celular."
              width={phone.w}
              height={phone.h}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </figure>
        </m.div>
      </div>

      <m.div {...reveal} className="mt-16">
        <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Demos no ar</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Seis exemplos com negócios fictícios de Fortaleza, feitos para mostrar o que cada tipo de projeto
          entrega. Cada um abre no site da Engrenagem.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((d) => {
            const img = shots[d.img]
            return (
              <li key={d.slug}>
                <a
                  href={`${SITE}exemplos/${d.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-line bg-bg/55 backdrop-blur-md transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <img
                    src={`/engrenagem/${d.img}.webp`}
                    alt={`Demo ${d.name}`}
                    width={img.w}
                    height={img.h}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm font-medium">{d.name}</span>
                    <span className="rounded-full border border-dashed border-line px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                      {d.kind}
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </m.div>
    </section>
  )
}
