# URL Routing Architecture

## Overview
This project adopts a **"URL-First"** routing strategy. Instead of conforming the folder structure to the desired URL hierarchy, we define the URL structure first, then implement it using Astro's dynamic routing capabilities.

## Principles
1. **Hierarchical Rule**: The URL hierarchy is defined as: `/{lang}/{author.id}/{slug}/`
   - `{lang}`: Language segment (1st level)
   - `{author.id}`: Domain separation (2nd level)
   - `{slug}`: Content identifier (3rd level)
2. **Dynamic Routing**: All paths are generated using `getStaticPaths()` in dynamic routes (`[lang]/[author]/[slug].astro`). This avoids constraints imposed by static folder hierarchies (e.g., collision between `/blog/` folder and `blog` author ID).
3. **Explicit Route Handling (Reserved Word Safeguard)**: To prevent routing collisions between dynamic routes (`[slug].astro`) and static special routes (`rss.xml`, `sitemap.xml`), we implement a two-layer defense:
   - **Layer 1 (Priority)**: Special routes are declared as dedicated files (`rss.xml.ts`, `sitemap.xml.ts`). Astro prioritizes these static files over dynamic routes.
   - **Layer 2 (Validation)**: An active build-time validator integration (`src/integrations/validate-routes.ts`), registered in `astro.config.mjs:integrations`, runs during the `astro:build:start` hook. It inspects all posts via `listPostFiles()` and asserts that:
     - No post slug collides with reserved route slugs (`RESERVED_SLUGS`: `rss.xml`, `sitemap.xml`, `index`, `rss`, `sitemap`, `favicon.ico`, `robots.txt`).
     - No duplicate `(localePath(lang), slug)` pairs exist across posts.
     - Every post has valid frontmatter YAML with a valid BCP 47 `lang` field.
     - No author ID collides with reserved segments (`RESERVED_AUTHOR_IDS`: `api`, `rss`, `sitemap`, `assets`, `admin`, `content`, `posts`, `authors`).
     Any conflict immediately fails the build (`throw new Error`).
4. **Data Neutrality**: Content collections are stored in `posts/{lang}/`, removing dependency on specific domain names (e.g., `blog`) at the data layer.

## Future Stability
This structure is intentionally designed for extensibility. Adding new content types or authors does not require file structure changes, only updates to data or `getStaticPaths` logic.
