const THEME_KEY = 'theme';

export function toggleTheme(): boolean {
  const element = document.documentElement;
  const isDark = element.classList.toggle('dark');
  element.classList.toggle('light', !isDark);
  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch {
    // Storage may be unavailable in privacy modes; keep the in-memory theme.
  }
  window.dispatchEvent(new CustomEvent('themeChange'));
  return isDark;
}
