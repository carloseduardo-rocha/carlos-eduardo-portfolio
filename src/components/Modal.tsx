import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Native <dialog> modal: focus trap, Escape and ::backdrop come from the browser.
 * Clicking the dim area closes it. Content is only mounted while `open`.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  className = '',
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label={label}
      className={`m-auto max-h-[90svh] w-[min(94vw,880px)] max-w-none overflow-y-auto rounded-2xl border border-line bg-bg p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] backdrop:bg-black/70 backdrop:backdrop-blur-sm ${className}`}
    >
      {open && children}
    </dialog>
  )
}
