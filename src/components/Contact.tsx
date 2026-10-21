import * as m from 'motion/react-m'
import { HeadArt } from '@/components/Art'
import { SectionHeading } from '@/components/SectionHeading'
import { whatsappLink } from '@/lib/whatsapp'

const channels = [
  {
    label: 'WhatsApp',
    value: '(85) 9 9179-9221',
    href: whatsappLink(),
    primary: true,
  },
  {
    label: 'E-mail',
    value: 'cadurocha39@gmail.com',
    href: 'mailto:cadurocha39@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'carlos-eduardo-rocha-da-silva',
    href: 'https://www.linkedin.com/in/carlos-eduardo-rocha-da-silva-408087230/',
  },
  {
    label: 'GitHub',
    value: 'carloseduardo-rocha',
    href: 'https://github.com/carloseduardo-rocha',
  },
] as const

function buildDate() {
  const d = new Date(__BUILD_DATE__)
  if (Number.isNaN(d.getTime())) return null
  return {
    iso: d.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Fortaleza' }).format(d),
  }
}

export function Contact() {
  const built = buildDate()
  return (
    <section id="contato" aria-labelledby="contato-title" className="mx-auto max-w-6xl px-6 pt-[16vh] md:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <SectionHeading n="08" id="contato-title" title="Vamos conversar" />
          <p className="mt-4 max-w-xl text-muted md:text-lg">
            Vaga, projeto ou só uma dúvida sobre desenvolvimento: me chama pelo canal que for mais fácil. O
            WhatsApp costuma ser o mais rápido.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {channels.map((c, i) => (
              <m.li
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6%' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className={`group flex h-full flex-col rounded-2xl border p-5 md:backdrop-blur-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    'primary' in c && c.primary
                      ? 'border-accent/60 bg-accent/10 hover:bg-accent/15'
                      : 'border-line bg-bg/75 md:bg-bg/55 hover:border-accent/60'
                  }`}
                >
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">{c.label}</span>
                  <span className="mt-2 break-all font-display text-lg font-semibold leading-tight">{c.value}</span>
                  <span aria-hidden="true" className="mt-4 text-sm text-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </m.li>
            ))}
          </ul>
        </div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto"
        >
          <HeadArt className="w-48 md:w-56 lg:w-64" />
        </m.div>
      </div>

      <footer className="mt-[14vh] flex flex-col gap-2 border-t border-line pt-6 pb-10 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Carlos Eduardo · Fortaleza, CE</p>
        {built && (
          <p>
            Última atualização: <time dateTime={built.iso}>{built.label}</time>
          </p>
        )}
      </footer>
    </section>
  )
}
