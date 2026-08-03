export function toggleTheme(): boolean {
  const element = document.documentElement;
  const isDark = element.classList.toggle('dark');
  if (!isDark) {
    element.classList.add('light');
  } else {
    element.classList.remove('light');
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  window.dispatchEvent(new CustomEvent('themeChange'));
  return isDark;
}
