// Let the browser paint the static shell in index.html before the app boots.
requestAnimationFrame(() => setTimeout(() => void import('./main'), 0))
