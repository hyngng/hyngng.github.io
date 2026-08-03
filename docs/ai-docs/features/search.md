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

Since Pagefind relies on indexing `dist/` (which only exists after building), the Pagefind search script is not available during local development (`npm run dev`).
To provide a smooth developer experience, `Search.astro` falls back to **DOM Title Filtering**:
- Each post card is pre-rendered with `data-title` and `data-path`.
- In development, the search bar checks if `/pagefind/pagefind.js` is loaded. If it's missing, it filters `.post-card` elements by checking if their titles contain the query.
- In production, it queries Pagefind and shows/hides matching cards based on `data-path`.

## Design & Color Tokens

The Search component uses existing design tokens defined in the theme system (`light.css` / `dark.css`):
- **Search Title**: `var(--color-muted)` (maps to `#877575` in light mode)
- **Search Bar Container Background**: `var(--color-post-card-bg)` (maps to `#E8EDF3` in light mode, `#2a2a2e` in dark mode)
- **Search Input Text**: `var(--color-text)`
- **Search Icon**: `var(--color-muted)`

## Responsive & Mobile Layout

- **Desktop (>1280px)**: The search bar is placed in the right sidebar (`.search-sidebar` in `BaseLayout.astro`) using absolute positioning (`left: 100%`). It remains sticky as the page scrolls.
- **Mobile (≤1280px)**: The sidebar is hidden via `.search-sidebar { display: none }`. An inline search bar (`.search-mobile-wrapper`) is rendered directly above the post list.
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
