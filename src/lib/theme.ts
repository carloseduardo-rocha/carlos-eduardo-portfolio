export type Theme = 'dark' | 'light'

const KEY = 'theme'
export const THEME_EVENT = 'themechange'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Applies + persists the theme (cross-fades with the View Transitions API when available). */
export function setTheme(next: Theme): void {
  const apply = () => {
    document.documentElement.dataset.theme = next
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'light' ? '#edf1f6' : '#04070d')
    dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }))
  }
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* private mode: the choice just won't persist */
  }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.startViewTransition(apply)
  } else {
    apply()
  }
}

export function subscribeTheme(cb: () => void): () => void {
  addEventListener(THEME_EVENT, cb)
  return () => removeEventListener(THEME_EVENT, cb)
}
