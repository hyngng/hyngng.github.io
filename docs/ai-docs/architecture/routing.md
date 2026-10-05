# URL Routing Architecture

## Post routes

Published posts use the author as the URL's first content segment and the post slug as the second:

- Default locale (`ko-KR`): `/{author}/{slug}/`, for example `/dev/armonia-devlog-planning/`.
- Other locales: `/{locale-segment}/{author}/{slug}/`, for example `/en/dev/armonia-devlog-planning/`.

The route handlers are `src/pages/[author]/[slug].astro` for the default locale and `src/pages/[lang]/[author]/[slug].astro` for other locales. They obtain posts from the `posts` content collection. `getPostSlug()` derives the slug from the post ID by removing the date prefix and file extension; the content directory names beneath `posts/{lang}/` do not define URL segments.

The URL author is the first value in `post.data.authors` and must match an entry in `ALL_AUTHORS`. The locale prefix is resolved through `src/utils/locale-segments.ts`; the default locale has no prefix, while other locales use the segment map (for example, `en-US` → `en`, `zh-CN` → `zh`). Use `getPostPath()` and `localePath()` from the post utilities when constructing links instead of deriving these paths from content folders.

## Route validation

`src/integrations/validate-routes.ts` validates post paths at `astro:build:start`. Its duplicate key reflects the generated route: `${localePath(lang)}/${author}/${slug}`. It also checks reserved route and author segments, post frontmatter and locale values. Keep this key aligned with both post route handlers when changing URL behavior.

## Legacy post URLs

`src/pages/posts/[slug].astro` emits static redirect pages for the legacy `/posts/{slug}/` path and for each path listed in a post's `redirect_from` frontmatter. It does not provide a general redirect for arbitrary old paths; add a `redirect_from` entry or an explicit redirect route when a legacy URL must remain available.

## Other routes

Static endpoints such as `sitemap.xml`, `robots.txt`, and locale-specific `rss.xml` are implemented as dedicated files under `src/pages/`. Author index pages use `[author]/index.astro` and `[lang]/[author]/index.astro`. Keep static endpoints explicit and reserved names in sync with the route validator.
