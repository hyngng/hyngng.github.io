export function animateNewCards(cards: HTMLElement[]) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card, index) => {
    card.classList.add('is-new');
    card.style.animationDelay = `${index * 50}ms`;

    const clear = () => {
      card.classList.remove('is-new');
      card.style.removeProperty('animation-delay');
    };

    card.addEventListener('animationend', clear, { once: true });
    card.addEventListener('animationcancel', clear, { once: true });
  });
}
