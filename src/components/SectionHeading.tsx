/** Shared heading for every real section: mono index + hairline, then the title. */
export function SectionHeading({ n, id, title }: { n: string; id: string; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.24em] text-muted">
        <span className="text-accent">{n}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2
        id={id}
        className="mt-5 font-display text-[clamp(1.8rem,5vw,3.4rem)] font-bold leading-tight tracking-tight"
      >
        {title}
      </h2>
    </div>
  )
}
