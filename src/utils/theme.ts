const THEME_KEY = 'theme';

export function toggleTheme(): boolean {
  const element = document.documentElement;
  const isDark = element.classList.toggle('dark');
  element.classList.toggle('light', !isDark);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  window.dispatchEvent(new CustomEvent('themeChange'));
  return isDark;
}
