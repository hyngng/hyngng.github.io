import { isMobile } from './layout';

const AUTHOR_CONTAINER = '.post-card-author';

// Mobile (<=960px): a tap on the card's author box opens the author page.
// A card is wrapped in a single <a>, so nesting an <a> is invalid HTML;
// instead intercept the card navigation at document level via delegation.
// Document-level delegation also covers cards appended later (chunks/search).
export function initMobileAuthorLink(signal?: AbortSignal): void {
  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    const author = (e.target as Element).closest<HTMLElement>(AUTHOR_CONTAINER);
    if (!author?.dataset.authorHref) return;
    e.preventDefault();
    window.location.assign(author.dataset.authorHref);
  }, { signal });
}
