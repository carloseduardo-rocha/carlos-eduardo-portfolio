import * as m from 'motion/react-m'
import { PhotoRing } from '@/components/PhotoRing'
import { whatsappLink } from '@/lib/whatsapp'

const links = [
  { label: 'WhatsApp', href: whatsappLink(), primary: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/carlos-eduardo-rocha-da-silva-408087230/',
  },
  { label: 'GitHub', href: 'https://github.com/carloseduardo-rocha' },
  { label: 'Currículo', href: '/Curriculo_Carlos_Eduardo_Dev.pdf' },
]

export function Intro() {
  return (
    <section id="intro" className="intro" aria-label="Apresentação">
      <div className="stage">
        <div className="hero-halo absolute inset-0 z-10 grid items-center px-6 pt-14 md:px-16 lg:px-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-10">
            <div className="order-2 md:order-1">
              <p className="hero-reveal font-mono text-xs uppercase tracking-[0.28em] text-accent md:text-sm">
                {'// Desenvolvedor Full Stack'}
              </p>
              <h1 className="hero-reveal mt-3 font-display text-[clamp(3rem,9.5vw,7.5rem)] font-bold leading-[0.9] tracking-tight md:mt-4">
                Carlos
                <br />
                Eduardo
              </h1>
              <p className="hero-reveal mt-5 max-w-xl text-base leading-relaxed text-muted md:mt-6 md:text-lg">
                Full stack com foco em back-end, em Fortaleza. Levo o sistema do levantamento de
                requisitos ao deploy: hoje em produção no GestãoCheck, um ERP usado por clientes reais.
              </p>
              <div
                className="hero-reveal mt-5 max-w-xl overflow-hidden rounded-xl border border-line bg-bg/60 font-mono text-[0.72rem] leading-relaxed backdrop-blur-md [@media(max-height:760px)]:hidden md:text-[0.8rem]"
                role="group"
                aria-label="Resumo"
              >
                <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5">
                  <span aria-hidden="true" className="size-2 rounded-full bg-[#ff5f57]" />
                  <span aria-hidden="true" className="size-2 rounded-full bg-[#febc2e]" />
                  <span aria-hidden="true" className="size-2 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">carlos@portfolio</span>
                </div>
                <dl className="space-y-1 px-3 py-2.5">
                  {[
                    ['whoami', 'carlos-eduardo · desenvolvedor full stack'],
                    ['cat stack.txt', 'Java · Spring Boot · Python · Flask · PostgreSQL · React · Docker'],
                    ['status', '● disponível para vagas júnior · Fortaleza / remoto'],
                  ].map(([cmd, out]) => (
                    <div key={cmd}>
                      <dt className="text-muted">
                        <span className="text-accent">$</span> {cmd}
                      </dt>
                      <dd className="text-fg/90">{out}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div data-hero-actions className="hero-reveal mt-6 flex flex-wrap gap-3 md:mt-8">
                {links.map((l) => (
                  <m.a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={
                      l.primary
                        ? 'rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg shadow-[0_0_28px_-6px_var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                        : 'rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                    }
                  >
                    {l.label}
                  </m.a>
                ))}
              </div>
            </div>

            <div className="hero-photo order-1 justify-self-start md:order-2 md:justify-self-end">
              <PhotoRing className="w-[clamp(96px,17svh,150px)] md:w-[clamp(240px,min(33vw,58svh),470px)]" />
            </div>
          </div>
        </div>

        <div className="cue absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted">
          <span>role para entrar</span>
          <m.span
            aria-hidden="true"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-8 w-px bg-gradient-to-b from-accent to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
