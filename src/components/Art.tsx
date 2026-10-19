import { RingFrame } from '@/components/PhotoRing'
import { Tilt } from '@/components/Tilt'
import art from '@/data/art-shots.json'

/** Illustrated desk selfie (Sobre): tilts toward the pointer, the picture zooms in slowly on hover. */
export function DeskArt({ className = '' }: { className?: string }) {
  return (
    <Tilt max={6} className={className}>
      <figure className="group overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_30px_70px_-30px_var(--color-accent)]">
        <img
          src="/art/desk.webp"
          alt="Ilustração de Carlos Eduardo no seu setup: fones no pescoço, editor com código Node.js, notebook com adesivos de Docker e PostgreSQL e um caderno de metas."
          width={art.desk.w}
          height={art.desk.h}
          loading="lazy"
          decoding="async"
          className="block aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <figcaption className="border-t border-line px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
          Meu setup, em versão ilustrada
        </figcaption>
      </figure>
    </Tilt>
  )
}

/** The 3D head (Contato): floats gently inside the tick ring and tilts toward the pointer. */
export function HeadArt({ className = '' }: { className?: string }) {
  return (
    <Tilt max={10} className={className}>
      <div className="float-y">
        <RingFrame>
          <img
            src="/art/head.webp"
            alt="Retrato 3D de Carlos Eduardo sorrindo, com um céu azul de fundo."
            width={art.head.w}
            height={art.head.h}
            loading="lazy"
            decoding="async"
            className="h-full w-full scale-[1.12] object-cover object-[50%_42%]"
          />
        </RingFrame>
      </div>
    </Tilt>
  )
}
