# GEO Audit Report: Elara Voss Portfolio

**Audit Date:** 2026-05-06
**URL:** https://astro-demo-elara-voss.pages.dev/ (canonical: elaravoss.dev)
**Business Type:** Personal Developer Portfolio / Agency (Services)
**Pages Analyzed:** 8

---

## Executive Summary

**Overall GEO Score: 61/100 (Fair)**

The site has an unusually strong technical foundation for a portfolio — explicit AI crawler allowances, a well-structured llms.txt, zero-JS SSG architecture on Cloudflare's edge CDN, and blog content with specific quantified claims that are genuinely citation-grade. These push the technical and citability scores well above average. The ceiling is set by two structural limitations: a fictional persona with no external brand presence on the authoritative platforms AI models use for entity verification (Wikipedia, Reddit, YouTube), and a schema layer with a critical duplicate-block bug on blog posts and missing required properties (image, dateModified) that block rich result eligibility.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 79/100 | 25% | 19.75 |
| Brand Authority | 22/100 | 20% | 4.40 |
| Content E-E-A-T | 64/100 | 20% | 12.80 |
| Technical GEO | 91/100 | 15% | 13.65 |
| Schema & Structured Data | 47/100 | 10% | 4.70 |
| Platform Optimization | 54/100 | 10% | 5.40 |
| **Overall GEO Score** | | | **60.7 → 61/100** |

---

## Critical Issues (Fix Immediately)

### CRIT-1: Duplicate JSON-LD on Every Blog Post Page

**Pages affected:** All 3 blog posts

Blog post pages emit two separate `<script type="application/ld+json">` blocks. The `WebSite` and `Person` schemas are injected twice — once from `BaseLayout.astro` and again from `BlogLayout.astro`. This creates identical `@id` collisions:

```
Block 1 (BaseLayout): WebSite, Person, SearchAction
Block 2 (BlogLayout): WebSite, Person, SearchAction, BlogPosting, BreadcrumbList
```

Both `"@id": "https://elaravoss.dev/#website"` and `"@id": "https://elaravoss.dev/#person"` appear twice. Google's parser likely deduplicates via `@id`, but some AI parsers flag this as invalid and may discard the entire graph. Every blog post is emitting ~3kb of redundant JSON-LD.

**Fix:** Pass a `suppressBaseSchema` prop from `BlogLayout` to `BaseLayout`. When `true`, `BaseLayout` should skip rendering its `StructuredData` component. `BlogLayout` then emits the full unified graph (WebSite + Person + BlogPosting + BreadcrumbList) in a single `<script>` block.

### CRIT-2: Missing `image` Property on All BlogPosting Schemas

**Pages affected:** All 3 blog posts

Google requires a raster image (`ImageObject` with `url`, `width`, `height`) on `Article`/`BlogPosting` schema for rich result eligibility. The current schema has no `image` property at all. This means all three blog posts are ineligible for Article rich results in Google Search, regardless of content quality.

**Fix:** Add an `image` property to the `BlogPosting` schema with a per-post OG image URL (JPEG/PNG, 1200×630px).

### CRIT-3: SVG Used for `Person.image` — Raster Required

**Pages affected:** All pages

`Person.image` currently points to `https://elaravoss.dev/og-default.svg`. Google does not accept SVG files for rich result image eligibility. A JPEG or PNG headshot is required.

**Fix:** Create a `headshot.jpg` (minimum 400×400px) and update `Person.image` to reference it.

---

## High Priority Issues

### HIGH-1: Blog Post URLs Missing from llms.txt

The three blog articles contain the site's best citation-grade content (specific metrics, ROI figures, benchmarks), but `/llms.txt` only lists blog *topics* — it does not link to individual posts. An AI model reading only `llms.txt` cannot discover the 380kb→14kb JS bundle reduction, the $1.77M/year design system ROI, or the INP 380ms→95ms improvement.

**Fix:** Add each blog post as a markdown link with a one-sentence stat summary to the Blog section of `llms.txt`.

### HIGH-2: No `/llms-full.txt` Companion File

The llms.txt spec recommends a full-text companion at `/llms-full.txt` containing the complete site corpus. Its absence means AI models relying on the llms.txt endpoint get a summary rather than the full content. This is the single highest-leverage llms.txt improvement available.

**Fix:** Create `/public/llms-full.txt` containing the full text of all three blog posts and the Services FAQ.

### HIGH-3: `dateModified` Identical to `datePublished` on All Posts

All three `BlogPosting` schemas set `dateModified` equal to `datePublished`. This signals to parsers that no article has ever been updated, which is both inaccurate and a missed freshness signal for AI systems that prefer recently-maintained content.

**Fix:** Update `dateModified` to reflect the actual last-edit date, and add an `updatedDate` field to the blog frontmatter schema so it can be maintained going forward.

### HIGH-4: No External Citations in Any Blog Post

All factual claims are asserted without links to primary sources. The Core Web Vitals post references Google's 2021 CWV ranking signal without linking to Google Search Central. The design system post references conversion rate correlation data without a source. The Astro post makes technical claims about bundle sizes with no linked evidence.

This weakens trustworthiness scores, creates a self-referential content graph (the only outbound link is to astro.build in the footer), and reduces the probability that AI systems treat the content as a citeable reference rather than unverified assertion.

**Fix:** Add 2-4 external citations per blog post linking to primary sources (web.dev, Google Search Central, MDN, official docs).

### HIGH-5: No Privacy Policy Page

The site is an Amsterdam-based services-for-hire business collecting email inquiries. Under GDPR, a privacy policy is legally required. Its absence also reduces trust scores for AI systems evaluating site credibility.

**Fix:** Add `/privacy/` page and link it in the footer alongside copyright.

### HIGH-6: Canonical Domain Not Yet Connected

Canonical tags, sitemap URLs, and structured data `@id` values all point to `elaravoss.dev`, but the custom domain is not yet connected to Cloudflare Pages. Until it is, the canonical chain is broken (canonicals point to URLs that don't resolve), Google Search Console cannot be registered, and any AI citations generated now will reference the staging domain.

**Fix:** Connect the custom domain in the Cloudflare Pages dashboard and configure DNS. Register in Google Search Console and Bing Webmaster Tools immediately after.

---

## Medium Priority Issues

### MED-1: Missing FAQPage Schema on /services/

The Services page has a clearly structured "Frequently Asked Questions" section with 4 Q&A pairs. No `FAQPage` schema is present. While FAQPage rich results are now restricted for most sites, the semantic schema still benefits AI models parsing the page for service queries.

**Fix:** Add `FAQPage`/`Question`/`acceptedAnswer` JSON-LD to the services page graph.

### MED-2: `speakable` Schema Missing on All Pages

`SpeakableSpecification` directly signals to AI assistants which content blocks are optimized for extraction and citation. Not present on any page.

**Fix:** Add a `speakable` property to the homepage and blog post schemas pointing to `h1` and intro paragraph CSS selectors.

### MED-3: OAI-SearchBot and ChatGPT-User Not in robots.txt

The wildcard `User-agent: *` covers these agents but explicit listing is best practice and signals active GEO intent. OpenAI separates `GPTBot` (training) from `OAI-SearchBot` (live search retrieval) and `ChatGPT-User` (browsing mode).

**Fix:** Add explicit entries for `OAI-SearchBot` and `ChatGPT-User` to `robots.txt`.

### MED-4: No `<lastmod>` Dates in Sitemap

The sitemap contains no `<lastmod>` elements, removing crawl scheduling hints for all 8 pages.

**Fix:** Configure `@astrojs/sitemap` to populate `<lastmod>` from post `pubDate` for blog pages and the current build date for static pages.

### MED-5: No Contextual Internal Links Between Posts

Blog posts cover overlapping topics (performance is referenced in the Astro post and the CWV post; design systems in both the Meridian project and the DS article) but there are zero contextual cross-links. The only internal links are navigation links.

**Fix:** Add 1-2 contextual links per blog post to related posts and relevant Work/Services pages.

### MED-6: Blog Content Is 14+ Months Old

The last post was published March 2025. As of the audit date (May 2026), all content is 14-16 months old. Perplexity's freshness threshold is approximately 12 months. The site has no update cadence visible to crawlers.

**Fix:** Publish a new post dated 2026. Add "Last updated" markers to the About and Services pages.

### MED-7: No Testimonials or Social Proof

The Services page describes deliverables in detail but provides zero social proof. No client quotes, no project references, no review markup. For AI systems evaluating whether to recommend a service provider, third-party validation is a significant trust signal.

**Fix:** Add 1-2 testimonials (even anonymized by role: "Engineering Manager, Series B fintech") to the Services page.

### MED-8: HSTS Header Not Confirmed

The `_headers` file does not include `Strict-Transport-Security`. Cloudflare may inject it at the zone level, but this should be verified and explicitly set.

**Fix:** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` to `_headers` under `/*`.

---

## Low Priority Issues

### LOW-1: `SearchAction` Using Deprecated `EntryPoint` Wrapper

Current schema wraps the SearchAction `target` in an `EntryPoint` object. Google's current preferred syntax is a plain URL string.

### LOW-2: `Person.description` Missing

The Person schema has `jobTitle` but no `description` bio. A 1-2 sentence bio improves entity completeness.

### LOW-3: No `keywords`/`articleSection` on BlogPosting

Blog post tags (Astro, React, Performance, etc.) are visible in the UI but not emitted in schema.

### LOW-4: Twitter/X URL Uses Legacy Domain

`sameAs` references `twitter.com` — should be `x.com` for current canonical.

### LOW-5: No Per-Page WebPage Schema

Pages like `/about/`, `/work/`, and `/services/` have no `WebPage` node with their own `@id`, `name`, and `isPartOf` references.

### LOW-6: No IndexNow for Bing

Bing-specific indexing acceleration via IndexNow is not implemented. A Cloudflare Pages deployment hook could ping IndexNow on each deploy.

### LOW-7: Per-Article OG Images

All pages share the same `og-default.svg` fallback. Individual OG images per blog post improve social preview richness and AI content signal quality.

---

## Category Deep Dives

### AI Citability (79/100)

**Strongest:** The blog posts are the site's GEO asset. Citation-grade passages:

| Content Block | Score | Why |
|---|---|---|
| Meridian: "40 hrs/week, 65 engineers, 12 products, $1.77M/yr" | 85/100 | 4 distinct data points, original research, complete in isolation |
| Lumino: "Lighthouse 54→100, organic impressions +34%, €50M ARR" | 84/100 | Business revenue context is rare and anchoring |
| Vela: "sub-16ms frames at 50,000 updates/sec" | 80/100 | Hard benchmarks, technology-specific |
| Performance Consulting: scope + €2,500 + 5-day turnaround | 80/100 | Answers "what does a CWV audit cost?" in one pass |

**Weakest:** Homepage project cards present the same statistics in single-line compressed form without the surrounding narrative that makes AI models confident citing them. The cards should grow to 3-4 sentence blocks with causal reasoning, not just outcomes.

### Brand Authority (22/100)

The structural ceiling for a fictional persona. AI models use Wikipedia, Wikidata, Reddit, and YouTube for entity verification — none are present. The schema `sameAs` links are correctly implemented and point to appropriate platforms, but the profiles don't exist. For a real deployment, brand authority is built entirely off-site: guest posts, conference talks, podcast appearances, Reddit/HN participation, and a Wikidata entry.

### Content E-E-A-T (64/100)

| Dimension | Score | Bottleneck |
|---|---|---|
| Experience | 20/25 | Strong first-person metrics; no client names or visual evidence |
| Expertise | 18/25 | Technical accuracy is current and correct; no verifiable credentials |
| Authoritativeness | 12/25 | Self-contained content graph; no inbound citations; no testimonials |
| Trustworthiness | 14/25 | HTTPS, contact email, pricing transparency — undercut by zero external citations |

The technical content is accurate and current (correct INP/FID transition, correct `scheduler.yield()` API, correct AVIF/WebP guidance). The expertise signals would score higher with verifiable external credentials. The biggest E-E-A-T lever is adding external citations to blog posts — a direct fix for the trustworthiness gap.

### Technical GEO (91/100)

This is the site's standout dimension and reflects genuine best-practice implementation:

- Astro 6 SSG → complete HTML in initial response, nothing gated behind JS
- Cloudflare Pages edge CDN → minimum TTFB, maximum availability
- All 8 major AI crawlers explicitly allowed by name in robots.txt
- `llms.txt` present and structured
- Full meta tag implementation: canonical, sitemap link, RSS alternate, OG, Twitter cards, author, robots max-snippet
- Content-addressed asset cache (1 year, immutable) + appropriate TTLs for feeds
- Zero raster images → zero CLS risk, zero LCP image optimization concerns
- System font stack → zero FOIT/FOUT

The 9-point gap: no `<lastmod>` in sitemap, HSTS not confirmed, and the temporary broken canonical chain (staging domain active, custom domain not yet connected).

### Schema & Structured Data (47/100)

| Dimension | Score |
|---|---|
| Completeness | 44/100 |
| Validity | 72/100 |
| GEO-Critical Opportunities | 35/100 |

The duplicate JSON-LD bug, missing `image` on BlogPosting, and SVG `Person.image` are the primary validity gaps. The opportunity gap is FAQPage (services page), `speakable` (all pages), per-project `CreativeWork` (work page), and `WebPage` per-page identity nodes. The correct schema types are being used — the implementation needs hardening.

### Platform Optimization (54/100)

| Platform | Score | Primary Gap |
|---|---|---|
| Google AI Overviews | 62/100 | No question-based H2 headings; missing FAQPage schema |
| Bing Copilot | 58/100 | No IndexNow; no Bing Webmaster Tools verification |
| Google Gemini | 55/100 | No YouTube presence; no Knowledge Graph entry |
| Perplexity AI | 51/100 | Content 14+ months old; no Reddit/forum presence |
| ChatGPT Web Search | 44/100 | No entity corroboration outside the site |

---

## Quick Wins (Implement This Week)

1. **Fix duplicate JSON-LD bug** — add `suppressBaseSchema` prop to BlogLayout → BaseLayout. No content work, pure code change. Affects schema validity score directly.

2. **Add blog post URLs + key stats to llms.txt** — 15 minutes of editing. Immediately surfaces the site's best citable content to AI models reading `/llms.txt`.

3. **Add FAQPage schema to /services/** — the Q&A content is already written. Encode 4 questions in JSON-LD. Benefits all AI platforms.

4. **Add OAI-SearchBot and ChatGPT-User to robots.txt** — two-line addition. Closes the ChatGPT entity access gap.

5. **Add HSTS and `<lastmod>` to sitemap** — one-line `_headers` change + sitemap config update. Improves security score and crawl freshness signals.

6. **Add description to Person schema and fix `dateModified`** — both are single-field additions to `StructuredData.astro`.

7. **Add 2 external citations to each blog post** — links to web.dev, Google Search Central, MDN. Directly improves trustworthiness and creates outbound link graph.

---

## 30-Day Action Plan

### Week 1: Schema & Technical Fixes
- [ ] Fix duplicate JSON-LD on blog posts (BaseLayout suppressBaseSchema)
- [ ] Add `image` property to BlogPosting schema (requires raster OG image per post)
- [ ] Replace SVG `Person.image` with raster headshot
- [ ] Fix `dateModified` ≠ `datePublished` on all blog posts
- [ ] Add OAI-SearchBot, ChatGPT-User to robots.txt
- [ ] Add `<lastmod>` to sitemap via @astrojs/sitemap config
- [ ] Add HSTS to `_headers`
- [ ] Add FAQPage schema to /services/
- [ ] Add `speakable` to homepage and blog post schemas
- [ ] Add `description` to Person schema

### Week 2: Content & llms.txt
- [ ] Add blog post URLs with key stats to llms.txt
- [ ] Create /public/llms-full.txt with full blog post text + services FAQ
- [ ] Add 2-4 external citations to each blog post
- [ ] Add contextual internal links between blog posts and to Work/Services pages
- [ ] Add "Last updated: [date]" markers to /about/ and /services/

### Week 3: Domain & Indexing
- [ ] Connect elaravoss.dev custom domain to Cloudflare Pages
- [ ] Register elaravoss.dev in Google Search Console; submit sitemap
- [ ] Add msvalidate.01 meta tag; register in Bing Webmaster Tools; submit sitemap
- [ ] Implement IndexNow (Cloudflare Pages deploy hook → api.indexnow.org)
- [ ] Add privacy policy page (/privacy/) linked from footer

### Week 4: Content & Social Proof
- [ ] Publish a new blog post (2026 date) to reset freshness signals
- [ ] Add 1-2 testimonials to Services page (anonymized by role if needed)
- [ ] Add question-based H2 headings to at least 2 blog posts with 40-word direct-answer openers
- [ ] Add `keywords`, `articleSection`, `wordCount` to BlogPosting schemas
- [ ] Create /llms-full.txt if not done in Week 2

---

## Appendix: Pages Analyzed

| URL | Title | Key Issues |
|---|---|---|
| / | Elara Voss — Senior Frontend Engineer | Homepage project cards under-developed as citable blocks |
| /about/ | About Elara Voss | No WebPage schema; no external credential links |
| /work/ | Work — Elara Voss | No project-level CreativeWork schema; card descriptions too short |
| /services/ | Services — Elara Voss | Missing FAQPage schema; no testimonials; no privacy policy link |
| /blog/ | Blog — Elara Voss | Content 14+ months old |
| /blog/ditching-react-for-astro/ | Why I Ditched React for Astro | Duplicate JSON-LD; missing BlogPosting image; no external citations |
| /blog/design-system-that-saved-40-hours/ | The Design System… | Duplicate JSON-LD; missing BlogPosting image; no external citations |
| /blog/core-web-vitals-practical-guide/ | Core Web Vitals… | Duplicate JSON-LD; missing BlogPosting image; no external citations |

---

*Generated by GEO Audit on 2026-05-06 · Site: astro-demo-elara-voss.pages.dev · Canonical: elaravoss.dev*
