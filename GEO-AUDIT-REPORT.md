# GEO Audit Report: Elara Voss Portfolio

**Audit Date:** 2026-05-07 (re-audit — previous: 2026-05-06)
**URL:** https://astro-demo-elara-voss.pages.dev/ (canonical: elaravoss.dev)
**Business Type:** Personal Developer Portfolio / Agency (Services)
**Pages Analyzed:** 9

---

## Executive Summary

**Overall GEO Score: 67/100 (Fair → approaching Good)**

Score improved +6 points over the 2026-05-06 baseline (61/100). The session delivered the two highest-leverage improvements available: raster images in JSON-LD schema (fixing two critical rich-result eligibility blocks) and Markdown endpoints for all blog posts with auto-discovery link tags (directly improving AI crawler access to citation-grade content). One regression was introduced: blog post `og:image` meta tags are now emitting relative URLs instead of absolute URLs — social crawlers and AI systems will fail to load the images. This is the top-priority fix.

### Score Breakdown

| Category | Score | Δ | Weight | Weighted Score |
|---|---|---|---|---|
| AI Citability | 88/100 | +9 | 25% | 22.00 |
| Brand Authority | 22/100 | 0 | 20% | 4.40 |
| Content E-E-A-T | 65/100 | +1 | 20% | 13.00 |
| Technical GEO | 97/100 | +6 | 15% | 14.55 |
| Schema & Structured Data | 72/100 | +25 | 10% | 7.20 |
| Platform Optimization | 60/100 | +6 | 10% | 6.00 |
| **Overall GEO Score** | | **+6** | | **67/100** |

### What Changed This Session

| Item | Status |
|---|---|
| CRIT-2: Missing raster `BlogPosting.image` | ✅ Fixed — per-post OG JPGs in schema |
| CRIT-3: SVG `Person.image` | ✅ Fixed — headshot.jpg (400×400) in schema |
| HIGH-1: Blog post URLs missing from llms.txt | ✅ Fixed — per-post links + stat summaries added |
| MED-4: No `<lastmod>` in sitemap | ✅ Fixed — serialize function in astro.config.mjs |
| Markdown endpoints for blog posts | ✅ New — `/blog/[slug].md` static routes + `<link rel="alternate">` |
| Responsive hero images | ✅ New — AVIF+WebP+JPG `<Picture />` on all blog posts + about page |
| `og:image` relative path regression | 🔴 New regression — absolute URL fix required |

---

## Critical Issues (Fix Immediately)

### CRIT-1: `og:image` Emitting Relative URL — Social/AI Crawlers Fail to Load

**Pages affected:** All 3 blog posts (and any page with a non-default OG image going forward)

When `ogImage="/og-ditching-react.jpg"` is passed to `BaseHead.astro`, the rendered meta tag is:

```html
<meta property="og:image" content="/og-ditching-react.jpg">
```

The Open Graph protocol requires an **absolute URL**. Social crawlers (Open Graph, Twitter Card), Perplexity, ChatGPT, and Google's rich result parser all require `https://domain.com/path` — relative paths are treated as invalid or silently dropped. The hero images added this session are invisible to every consumer of og:image.

**Fix in `src/components/BaseHead.astro`:**
```ts
const absoluteOgImage = ogImage?.startsWith('/')
  ? `${siteUrl}${ogImage.slice(1)}`
  : (ogImage ?? `${siteUrl}og-default.jpg`);
```
Then use `absoluteOgImage` in the meta tags. (Note: `siteUrl` already has a trailing slash in the existing code, so `ogImage.slice(1)` strips the leading `/`.)

### CRIT-2: Duplicate JSON-LD on Every Blog Post Page

**Pages affected:** All 3 blog posts

Blog post pages emit two separate `<script type="application/ld+json">` blocks. The `WebSite` and `Person` schemas are injected twice — once from `BaseLayout.astro` and again from `BlogLayout.astro`. Both `"@id": "https://elaravoss.dev/#website"` and `"@id": "https://elaravoss.dev/#person"` appear twice. Some AI parsers flag `@id` collisions as invalid and discard the entire graph. Every blog post is emitting ~3kb of redundant JSON-LD.

**Fix:** `BlogLayout.astro` already passes `suppressBaseSchema={true}` to `BaseLayout`. Verify that `BaseLayout` actually gates its `StructuredData` render on this prop — if the duplicate still appears in `view-source`, the prop is being passed but not checked.

### CRIT-3: elaravoss.dev Domain Not Connected

All canonical URLs, sitemap, structured data `@id` values, and `llms.txt` links point to `elaravoss.dev` which does not resolve. The canonical chain is broken: Google's parser discovers `<link rel="canonical" href="https://elaravoss.dev/...">` but cannot fetch the canonical URL. Google Search Console cannot be registered, and AI citations generated against the staging domain will not transfer to the real domain.

**Fix:** Connect `elaravoss.dev` in the Cloudflare Pages dashboard → Custom Domains. Register in Google Search Console and submit sitemap immediately after. Add `msvalidate.01` meta tag and register in Bing Webmaster Tools.

---

## High Priority Issues

### HIGH-1: `BlogPosting.publisher` Node Type Error

`publisher` in `BlogPosting` currently references `{ "@id": "https://elaravoss.dev/#website" }`. Schema.org requires `publisher` to be an `Organization` or `Person` — not a `WebSite`. The `@id` reference resolves to the wrong node type, causing a schema validation error.

**Fix in `StructuredData.astro`:**
```json
"publisher": {
  "@type": "Person",
  "@id": "https://elaravoss.dev/#person"
}
```

### HIGH-2: `speakable` CSS Selector Too Broad

The `SpeakableSpecification` on blog posts uses `cssSelector: "p:first-of-type"`. This matches the first `<p>` in every element on the page, not just the article intro. The correct selector is `.prose p:first-of-type` (scoped to the article container).

**Fix in `StructuredData.astro`:** Change `"p:first-of-type"` to `".prose p:first-of-type"`.

### HIGH-3: No `/llms-full.txt` Companion File

`/llms.txt` now links to all blog posts and their `.md` endpoints — a significant improvement. The next step per the llms.txt spec is `/llms-full.txt`: a single document containing the full text of all key pages (all three blog posts + the services FAQ). AI models that fetch `llms-full.txt` get the complete corpus in one request without following individual links.

**Fix:** Create `public/llms-full.txt` with the full Markdown content of all three blog posts and the services page FAQ section. Link it from `llms.txt`.

### HIGH-4: `dateModified` Identical to `datePublished` on All Posts

All three `BlogPosting` schemas set `dateModified` equal to `datePublished`. This signals to parsers that no article has ever been updated — a missed freshness signal.

**Fix:** Add an `updatedDate` field to blog post frontmatter and pass it through to `StructuredData`. Use the current ISO date as the initial value now that images and markdown endpoints have been added.

### HIGH-5: No External Citations in Any Blog Post

All factual claims are asserted without links to primary sources. This weakens trustworthiness scores and reduces AI citation probability (unverifiable assertions are less likely to be cited than sourced claims).

**Fix:** Add 2-4 external citations per blog post linking to `web.dev`, Google Search Central, MDN, or official docs. The CWV post should link to the CWV ranking signal announcement; the Astro post should link to Astro's own performance benchmarks.

### HIGH-6: No Privacy Policy Page

Amsterdam-based services business collecting email inquiries — GDPR requires a privacy policy. Its absence also signals incomplete site structure to AI trust evaluators.

**Fix:** Add `/privacy/` page linked from the footer.

---

## Medium Priority Issues

### MED-1: Missing FAQPage Schema on /services/

The Services page has a clearly structured FAQ section with 4 Q&A pairs. No `FAQPage` schema is present.

**Fix:** Add `FAQPage`/`Question`/`acceptedAnswer` JSON-LD to the services page.

### MED-2: OAI-SearchBot and ChatGPT-User Not Explicitly in robots.txt

The wildcard `User-agent: *` covers these agents but explicit listing signals active GEO intent. OpenAI separates `GPTBot` (training) from `OAI-SearchBot` (live search retrieval) and `ChatGPT-User` (browsing mode).

**Fix:** Add explicit `Allow: /` entries for both agents.

### MED-3: No Contextual Internal Links Between Posts

Blog posts cover overlapping topics but have zero contextual cross-links. Internal links directly improve AI graph traversal of the site.

**Fix:** Add 1-2 contextual links per post to related posts and to Work/Services pages.

### MED-4: Blog Content Is 14+ Months Old

The last post was March 2025. As of May 2026 all content is 14-16 months old. Perplexity's freshness threshold is approximately 12 months.

**Fix:** Publish a new post dated 2026. Add "Last updated: May 2026" markers to `/about/` and `/services/`.

### MED-5: No Testimonials or Social Proof

Services page has no client quotes or review markup. Third-party validation is a significant trust signal for AI systems evaluating whether to recommend a service provider.

**Fix:** Add 1-2 anonymized testimonials (by role: "Engineering Manager, Series B fintech").

### MED-6: Sitemap `lastmod` Using Build Time, Not Content Date

The `serialize` function in `astro.config.mjs` sets `item.lastmod = new Date().toISOString()` on every page. This is accurate for static pages but misleading for blog posts — all three posts will report the same `lastmod` as the homepage, regardless of when they were actually written.

**Fix:** In the serialize function, check `item.url` for blog post paths and derive `lastmod` from the post's `pubDate` or `updatedDate` frontmatter. Import the content collection or use a build-time date map.

---

## Low Priority Issues

### LOW-1: `SearchAction` Using Deprecated `EntryPoint` Wrapper
Current schema wraps the `SearchAction` target in an `EntryPoint` object. Google's current preferred syntax is a plain URL string with `{search_term_string}` template.

### LOW-2: `Person.description` Missing
`Person` schema has `jobTitle` but no `description`. A 1-2 sentence bio improves entity completeness.

### LOW-3: No `keywords`/`articleSection` on BlogPosting
Post tags visible in the UI are not emitted in schema.

### LOW-4: Twitter/X URL Uses Legacy Domain
`sameAs` references `twitter.com` — should be `x.com`.

### LOW-5: No Per-Page WebPage Schema
Pages `/about/`, `/work/`, `/services/` have no `WebPage` node with `@id`, `name`, and `isPartOf`.

### LOW-6: No IndexNow for Bing
Bing indexing acceleration via IndexNow is not implemented.

---

## Category Deep Dives

### AI Citability (88/100, was 79)

**What improved:** The `llms.txt` additions are the primary driver — all three blog posts are now directly linked with one-sentence stat summaries, meaning an AI model reading only `/llms.txt` immediately surfaces the $1.77M/year design system ROI, the 380kb→14kb JS bundle reduction, and the INP 380ms→95ms improvement. The Markdown endpoints (`/blog/[slug].md`) and `<link rel="alternate" type="text/markdown">` give crawlers a clean, frontmatter-stripped, citation-ready version of each post. Combined these are the two highest-citability improvements available without adding new content.

**Remaining ceiling:** Homepage project cards still present statistics in compressed single-line form. The cards should grow to 3-4 sentence blocks with causal reasoning.

### Brand Authority (22/100, unchanged)

The structural ceiling for a fictional persona. Wikipedia, Wikidata, Reddit, YouTube — none are present. For a real deployment, brand authority is built entirely off-site.

### Content E-E-A-T (65/100, was 64)

| Dimension | Score | Bottleneck |
|---|---|---|
| Experience | 20/25 | Strong first-person metrics; no client names or visual evidence |
| Expertise | 18/25 | Technical accuracy correct; no verifiable external credentials |
| Authoritativeness | 13/25 | Self-contained graph; no inbound citations; no testimonials |
| Trustworthiness | 14/25 | HTTPS, pricing transparency — still no external citations |

Marginal bump from the richer image attribution (blog hero images signal more invested authorship). The biggest lever remains external citations in blog posts.

### Technical GEO (97/100, was 91)

**What improved:**
- Markdown endpoints (`/blog/[slug].md`) with proper `Content-Type: text/markdown; charset=utf-8` — AI crawlers get structured Markdown without HTML parsing overhead
- `<link rel="alternate" type="text/markdown">` auto-discovery in every blog post `<head>`
- Sitemap `<lastmod>` now populated on every page
- llms.txt Markdown URL references enable direct content access for models that follow them

**Remaining 3-point gap:** Sitemap lastmod not derived from content dates (build time only), broken canonical chain (custom domain not connected), and no IndexNow integration.

### Schema & Structured Data (72/100, was 47)

**What improved (25-point gain):** The two critical blocking issues are resolved. `BlogPosting.image` now has per-post `ImageObject` with correct `url`/`width`/`height` (raster JPEG, 1200×630). `Person.image` now references `headshot.jpg` (400×400 JPEG) — eligible for Google's rich result parser. These two fixes alone unlock Article rich result eligibility for all three blog posts.

**Remaining gaps:** Duplicate JSON-LD (CRIT-2), `publisher` node type error (HIGH-1), `speakable` CSS selector (HIGH-2), missing FAQPage on services, no per-page WebPage nodes, missing `description` on Person.

### Platform Optimization (60/100, was 54)

| Platform | Score | Change | Primary Remaining Gap |
|---|---|---|---|
| Google AI Overviews | 68/100 | +6 | No question-based H2 headings; FAQPage schema missing |
| Bing Copilot | 63/100 | +5 | No IndexNow; no Bing Webmaster Tools |
| Google Gemini | 60/100 | +5 | No YouTube; no Knowledge Graph entry |
| Perplexity AI | 56/100 | +5 | Content 14+ months old; no forum presence |
| ChatGPT Web Search | 52/100 | +8 | Markdown endpoints help; entity corroboration still off-site only |

---

## Quick Wins (Implement This Week)

1. **Fix `og:image` relative URL** — 3-line change in `BaseHead.astro`. Restores OG image functionality for all social crawlers and AI platforms. This is a regression; fix first.

2. **Fix `BlogPosting.publisher` type** — 2-line change in `StructuredData.astro`. Removes a schema validation error on all 3 blog posts.

3. **Fix `speakable` CSS selector** — 1-line change in `StructuredData.astro`. Scopes the speakable region correctly to the article prose container.

4. **Add FAQPage schema to /services/** — content is already written; encode 4 questions in JSON-LD. Lifts Google AI Overview eligibility.

5. **Add `dateModified` to blog post frontmatter** — set to today's date (May 2026) to reflect the hero image + Markdown endpoint additions. Resets freshness signals on all three posts.

6. **Add OAI-SearchBot and ChatGPT-User to robots.txt** — two-line addition. Signals active GEO intent to OpenAI's search retrieval crawler.

---

## 30-Day Action Plan

### Week 1: Fix Regressions + Schema Hardening
- [ ] Fix `og:image` relative URL bug in `BaseHead.astro` (CRIT-1)
- [ ] Verify/fix duplicate JSON-LD on blog posts (CRIT-2)
- [ ] Fix `BlogPosting.publisher` node type (HIGH-1)
- [ ] Fix `speakable` CSS selector to `.prose p:first-of-type` (HIGH-2)
- [ ] Update `dateModified` on all 3 blog posts to 2026-05-07
- [ ] Add FAQPage schema to /services/ (MED-1)
- [ ] Add OAI-SearchBot and ChatGPT-User to robots.txt (MED-2)
- [ ] Add `description` to Person schema (LOW-2)

### Week 2: Content & llms.txt
- [ ] Create /public/llms-full.txt with full blog post text + services FAQ (HIGH-3)
- [ ] Add 2-4 external citations to each blog post (HIGH-5)
- [ ] Add contextual internal links between posts and to Work/Services (MED-3)
- [ ] Add "Last updated: May 2026" markers to /about/ and /services/ (MED-4)
- [ ] Fix sitemap lastmod to use content dates rather than build time (MED-6)

### Week 3: Domain & Indexing
- [ ] Connect elaravoss.dev custom domain to Cloudflare Pages (CRIT-3)
- [ ] Register in Google Search Console; submit sitemap
- [ ] Add msvalidate.01 meta; register in Bing Webmaster Tools; submit sitemap
- [ ] Implement IndexNow (Cloudflare Pages deploy hook) (LOW-6)
- [ ] Add privacy policy page /privacy/ (HIGH-6)

### Week 4: Content & Social Proof
- [ ] Publish a new 2026-dated blog post (MED-4)
- [ ] Add 1-2 testimonials to Services page (MED-5)
- [ ] Add question-based H2 headings to 2 blog posts with 40-word direct-answer openers
- [ ] Add `keywords`, `articleSection`, `wordCount` to BlogPosting schemas (LOW-3)
- [ ] Create per-page WebPage schema for /about/, /work/, /services/ (LOW-5)

---

## Appendix: Pages Analyzed

| URL | Title | Session Changes | Remaining Issues |
|---|---|---|---|
| / | Elara Voss — Senior Frontend Engineer | — | Project cards lack citable narrative depth |
| /about/ | About Elara Voss | Profile photo (Picture component) | No WebPage schema; no external credential links |
| /work/ | Work — Elara Voss | — | No CreativeWork schema; card descriptions short |
| /services/ | Services — Elara Voss | — | No FAQPage schema; no testimonials; no privacy link |
| /blog/ | Blog — Elara Voss | — | Content 14+ months old |
| /blog/ditching-react-for-astro/ | Why I Ditched React for Astro | Hero image, OG image in schema, .md endpoint | og:image relative URL; duplicate JSON-LD; no citations |
| /blog/design-system-that-saved-40-hours/ | The Design System… | Hero image, OG image in schema, .md endpoint | og:image relative URL; duplicate JSON-LD; no citations |
| /blog/core-web-vitals-practical-guide/ | Core Web Vitals… | Hero image, OG image in schema, .md endpoint | og:image relative URL; duplicate JSON-LD; no citations |
| /blog/ditching-react-for-astro.md | Markdown endpoint | New this session | Served correctly; no issues |

---

*Generated by GEO Audit on 2026-05-07 · Site: astro-demo-elara-voss.pages.dev · Canonical: elaravoss.dev*
*Previous audit: 2026-05-06 · Previous score: 61/100 · Delta: +6*
