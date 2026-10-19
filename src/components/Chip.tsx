/** Small mono pill used for stacks, tags and feature lists. Render inside a <ul>. */
export function Chip({ children, dashed = false }: { children: string; dashed?: boolean }) {
  return (
    <li
      className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted ${
        dashed ? 'border-dashed border-line' : 'border-line bg-bg/40'
      }`}
    >
      {children}
    </li>
  )
}
