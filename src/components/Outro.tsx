import * as m from 'motion/react-m'

function toTop() {
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function Outro() {
  return (
    <section id="outro" className="outro" aria-label="Fim da página">
      <div className="stage">
        {/* the logo (particles) sits above; the closing copy lives in the lower third */}
        <div className="absolute inset-x-0 bottom-0 z-10 grid justify-items-center gap-3 px-6 pb-[max(1.5rem,5vh)] text-center">
          <p className="outro-reveal font-mono text-xs uppercase tracking-[0.28em] text-accent">
            {'// fim da linha'}
          </p>
          <h2 className="outro-reveal font-display text-[clamp(1.5rem,4vw,2.6rem)] font-bold leading-tight tracking-tight">
            Obrigado por rolar até aqui.
          </h2>
          <div data-outro-actions className="outro-reveal mt-1">
            <m.button
              type="button"
              onClick={toTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer rounded-full border border-line px-5 py-2 text-sm font-medium text-fg md:backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Voltar ao início ↑
            </m.button>
          </div>
          <div className="outro-reveal mt-2 flex flex-col items-center gap-2.5">
            <div className="loop-bar" aria-hidden="true">
              <span />
            </div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted">
              continue rolando para recomeçar
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
