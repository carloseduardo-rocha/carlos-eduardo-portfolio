import { useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme, type Theme } from '@/lib/theme'

/** Current theme as a React value (re-renders on toggle). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme, () => 'dark' as const)
}
