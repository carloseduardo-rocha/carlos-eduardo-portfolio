// Apply the saved theme before first paint (default: dark). Kept as a file so the CSP can forbid inline scripts.
try {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.dataset.theme = 'light'
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#edf1f6')
  }
} catch (e) {}
