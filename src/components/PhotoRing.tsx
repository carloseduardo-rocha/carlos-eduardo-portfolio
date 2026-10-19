const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2
  const long = i % 6 === 0
  const r0 = 94
  const r1 = long ? 99.5 : 97
  return {
    x1: 100 + Math.cos(a) * r0,
    y1: 100 + Math.sin(a) * r0,
    x2: 100 + Math.cos(a) * r1,
    y2: 100 + Math.sin(a) * r1,
  }
})

/** Round frame wrapped in a slowly turning tick ring — the same motif as the particle logo. */
export function RingFrame({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="ring-spin absolute inset-0 h-full w-full text-accent"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        {TICKS.map((t, i) => (
          <line key={i} {...t} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
        ))}
      </svg>
      <div className="absolute inset-[9%] overflow-hidden rounded-full border border-line shadow-[0_0_70px_-18px_var(--color-accent)]">
        {children}
      </div>
    </div>
  )
}

/** The real profile photo: navy shirt on dark, white shirt on light (swapped in CSS, only the visible one loads). */
export function PhotoRing({ className = '' }: { className?: string }) {
  return (
    <RingFrame className={className}>
      <img
        src="/photos/carlos.jpg"
        alt="Carlos Eduardo, Desenvolvedor Full Stack"
        width="800"
        height="800"
        loading="lazy"
        decoding="async"
        className="photo-dark h-full w-full object-cover"
      />
      <img
        src="/photos/carlos-light.jpg"
        alt="Carlos Eduardo, Desenvolvedor Full Stack"
        width="720"
        height="720"
        loading="lazy"
        decoding="async"
        className="photo-light h-full w-full object-cover"
      />
    </RingFrame>
  )
}
