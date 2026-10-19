/**
 * Shared state between the scroll choreography (GSAP) and the 3D stage (Three).
 *
 *  - intro: 0 → 1 while the "doors" open at the top of the page
 *  - outro: 0 → 1 while they close again at the bottom
 *  - target: where the particles should be (0 = closed logo, 1 = open field)
 *  - reduced: user prefers reduced motion → no intro, no loop, static scene
 */
export type PortalState = {
  intro: number
  outro: number
  target: number
  reduced: boolean
}

export const portal: PortalState = {
  intro: 0,
  outro: 0,
  target: 0,
  reduced:
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export function syncPortal(): void {
  portal.target = portal.outro > 0 ? 1 - portal.outro : portal.intro
}
