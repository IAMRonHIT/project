export const shortcuts = {
  'alt+n': 'New Case',
  'alt+f': 'Quick Filter',
  'alt+s': 'Quick Search',
  'alt+r': 'Review Selected',
  'alt+d': 'Download Report'
};

export function initializeKeyboardShortcuts(handlers: Record<string, () => void>) {
  document.addEventListener('keydown', (e) => {
    const key = `${e.altKey ? 'alt+' : ''}${e.key.toLowerCase()}`;
    if (handlers[key]) {
      e.preventDefault();
      handlers[key]();
    }
  });
}