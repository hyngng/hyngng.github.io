# Search Feature Specification (Pagefind)

This document describes the design and implementation of the client-side search feature.

## Architecture & Framework

We use **Pagefind** for static search indexing and retrieval.

### Multi-language Search Isolation

Pagefind is configured to isolate search queries by language using data attributes:
- Each post layout (`PostLayout.astro`) marks the root post element with `data-pagefind-filter="lang:<lang_code>"` (e.g. `lang:ko` or `lang:en`).
- When querying Pagefind, the language parameter is passed:
  ```javascript
  pagefind.search(query, {
    filters: { lang: currentLocale }
  });
  ```
- This ensures search queries in the Korean view only yield Korean posts, English yields English posts, etc.

### Indexing Scope

To prevent indexing global navigation elements (like header logos, author profiles, and sidebars), we restrict Pagefind's index to the actual post body:
- The main content block inside `PostLayout.astro` is marked with `data-pagefind-body`. Pagefind will ignore all content outside this container.

### Dev Mode Fallback

Pagefind indexes `dist/` at build time. During local development (`npm run dev`), `vite-plugin-pagefind` (`astro.config.mjs` → `vite.plugins`) copies the existing `dist/pagefind/` bundle to `public/pagefind/` so `/pagefind/pagefind.js` is served by the dev server (MIME-safe `text/javascript`).
- The plugin's `developStrategy: 'lazy'` only copies when the dev server starts; run `npm run build` first (or after content changes) so the index reflects the latest posts.
- `Search.astro` still falls back to **DOM Title Filtering** if `/pagefind/pagefind.js` is unavailable (e.g. `dist/pagefind/` doesn't exist yet). Each post card is pre-rendered with `data-title` and `data-path` for this fallback.
- In production, the postbuild `pagefind --site dist --output-path dist/pagefind` step generates the index, and Search queries Pagefind, showing/hiding matching cards based on `data-path`.

## Design & Color Tokens

The Search component uses existing design tokens defined in the theme system (`light.css` / `dark.css`):
- **Search Title**: `var(--color-muted)` (maps to `#877575` in light mode)
- **Search Bar Container Background**: `var(--color-post-card-bg)` (maps to `#E8EDF3` in light mode, `#2a2a2e` in dark mode)
- **Search Input Text**: `var(--color-text)`
- **Search Icon**: `var(--color-muted)`

## Responsive & Mobile Layout

- **Desktop (>1280px)**: The search bar is placed in the right sidebar (`.search-sidebar`) using absolute positioning (`left: 100%`). It remains sticky as the page scrolls. The title (`.search-title`) and the input bar (`.search-bar`) are stacked vertically.
- **Mobile (≤1280px)**: The sidebar is hidden via `.search-sidebar { display: none }`. An inline search bar (`.search-mobile-wrapper`) is rendered directly above the post list in the central area. The `.search-title` (`검색` label) is hidden (`display: none`) since the label only appears in the desktop sidebar, and `.search-bar` expands to `width: 100%`.
- **Tablet (961–1280px)**: `.search-mobile-wrapper` is absolutely positioned (`right: 0`) against the `position: relative` `.content-body-layout`, so the search bar is vertically centered on the `포스트` section-title row and right-aligned to the content column edge. Its vertical offset is derived from tokens: `top: calc(var(--posts-section-margin-top) + (var(--section-title-line-height) - var(--search-bar-height)) / 2)`. The `.search-bar` width follows the wrapper's `var(--search-bar-width)`.
- **Mobile (≤960px)**: On the root page the `Authors` section and the `포스트` section title (`.section-title` in `PostListSection`) are hidden, so the search sits directly above the post cards. The border-radius stays `20px` (unlike the `12px` post cards). The gap between the search bar and the post list is `--space-search-posts-gap` (`16px`, applied as `.posts-section` margin-top on mobile), while the gap above the search (`--posts-section-margin-top`, `40px` on mobile) is unchanged.
- **Query Sync**: Multiple search inputs synchronize their values when the user types, ensuring the search state is preserved during viewport resize or orientation changes.

## Search-Controller Integration

The search feature no longer directly manipulates the DOM or calls legacy global APIs. Instead, it communicates with the `PostListController` via the shared registry (`src/features/post-list/registry.ts`).

### Controller Interface

`Search.astro` uses two controller methods:

| Method | When | Behavior |
|---|---|---|
| `controller.showSearchResults(paths)` | Search results ready | Hides non-matching cards, hides load-more, toggles empty state |
| `controller.clearSearch()` | Query cleared | Removes search-loaded cards, shows all original cards, restores load-more, relayouts masonry |
| `controller.fetchSearchChunk(n)` | Need unloaded chunk | Fetches chunk HTML, extracts cards, inserts into appropriate column, tracks for cleanup |

### Search-Chunk Integration

The search feature integrates with the chunk loading system to search across **all posts**, not just the ones currently loaded in the DOM.

#### Problem

Pagefind indexes all posts at build time, but DOM queries only cover currently loaded cards. Posts in unloaded chunks are invisible to the search filter.

#### Solution: `ensureMatchingChunksLoaded` + Controller

`Search.astro` determines which unloaded chunks contain matching posts using `data-all-posts` metadata, then:

1. For each needed chunk, calls `controller.fetchSearchChunk(n)` which handles fetching, parsing, and inserting cards into the correct column
2. The controller marks inserted cards internally (via `searchTagged` Set) for cleanup on `clearSearch()`
3. After all chunks are loaded, calls `controller.showSearchResults(paths)` to filter visibility

### Search Flow

1. `pagefind.search(query)` returns matching URLs from the full index
2. `ensureMatchingChunksLoaded()` determines which chunks contain matching posts using `data-all-posts` metadata
3. `controller.fetchSearchChunk(n)` fetches each needed chunk and inserts cards
4. `controller.showSearchResults(paths)` filters all DOM cards (original + search-loaded) against Pagefind results

### Data Attributes

| Attribute | Location | Purpose |
|---|---|---|
| `data-all-posts` | `.posts-grid` | JSON array of `{path, title}` for all posts — enables chunk calculation without fetching |
| `data-path` | `.post-card` | Post URL for Pagefind result matching |
| `data-title` | `.post-card` | Post title for dev mode DOM fallback |
