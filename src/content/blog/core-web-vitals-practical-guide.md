---
title: "Core Web Vitals Aren't Optional: A Practical Guide for 2025"
description: "LCP, CLS, INP explained with real fixes you can ship today. No fluff — just the patterns that actually move the needle on Core Web Vitals."
pubDate: 2025-01-22
updatedDate: 2026-05-06
author: "Elara Voss"
tags: ["Performance", "Core Web Vitals", "SEO", "JavaScript"]
---

Google's [Core Web Vitals](https://web.dev/articles/vitals) have been a ranking signal since 2021. Most engineering teams know this. Fewer teams have actually done the work to achieve "Good" ratings across all three metrics. I've spent the last two years doing Core Web Vitals audits and fixes for clients across e-commerce, SaaS, and media. Here's what I've learned.

<figure style="margin: 1.5rem 0; padding: 1.5rem; background: #161b22; border: 1px solid #30363d; border-radius: 0.75rem;" role="img" aria-label="Core Web Vitals thresholds: Good, Needs Improvement, Poor">
  <svg viewBox="0 0 480 110" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
    <text x="0" y="16" font-family="monospace" font-size="11" fill="#8b949e">Core Web Vitals — thresholds at a glance</text>
    <!-- LCP row -->
    <text x="0" y="46" font-family="monospace" font-size="10" fill="#e6edf3" font-weight="bold">LCP</text>
    <rect x="50" y="34" width="100" height="18" rx="4" fill="#3fb950" opacity="0.85"/>
    <text x="100" y="47" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Good &lt;2.5s</text>
    <rect x="156" y="34" width="100" height="18" rx="4" fill="#e3a008" opacity="0.85"/>
    <text x="206" y="47" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Needs impr.</text>
    <rect x="262" y="34" width="100" height="18" rx="4" fill="#e85555" opacity="0.85"/>
    <text x="312" y="47" font-family="monospace" font-size="9" fill="#e6edf3" text-anchor="middle" font-weight="bold">Poor &gt;4s</text>
    <!-- CLS row -->
    <text x="0" y="76" font-family="monospace" font-size="10" fill="#e6edf3" font-weight="bold">CLS</text>
    <rect x="50" y="64" width="100" height="18" rx="4" fill="#3fb950" opacity="0.85"/>
    <text x="100" y="77" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Good &lt;0.1</text>
    <rect x="156" y="64" width="100" height="18" rx="4" fill="#e3a008" opacity="0.85"/>
    <text x="206" y="77" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Needs impr.</text>
    <rect x="262" y="64" width="100" height="18" rx="4" fill="#e85555" opacity="0.85"/>
    <text x="312" y="77" font-family="monospace" font-size="9" fill="#e6edf3" text-anchor="middle" font-weight="bold">Poor &gt;0.25</text>
    <!-- INP row -->
    <text x="0" y="106" font-family="monospace" font-size="10" fill="#e6edf3" font-weight="bold">INP</text>
    <rect x="50" y="94" width="100" height="18" rx="4" fill="#3fb950" opacity="0.85"/>
    <text x="100" y="107" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Good &lt;200ms</text>
    <rect x="156" y="94" width="100" height="18" rx="4" fill="#e3a008" opacity="0.85"/>
    <text x="206" y="107" font-family="monospace" font-size="9" fill="#0d1117" text-anchor="middle" font-weight="bold">Needs impr.</text>
    <rect x="262" y="94" width="100" height="18" rx="4" fill="#e85555" opacity="0.85"/>
    <text x="312" y="107" font-family="monospace" font-size="9" fill="#e6edf3" text-anchor="middle" font-weight="bold">Poor &gt;500ms</text>
  </svg>
  <figcaption style="font-size:0.75rem;color:#8b949e;margin-top:0.5rem;font-family:monospace">Source: web.dev/vitals — measured at 75th percentile of real-user data</figcaption>
</figure>

## Why CWV Still Matter in 2025

The cynical view is that CWV are a Google PR exercise — a way to nudge the web toward better performance while conveniently aligning with Google's own interests. That's partially true and entirely irrelevant. Faster pages convert better. [Google's own research](https://web.dev/articles/why-cwa-speed-matters) shows that sites loading in 1 second convert 3x better than sites loading in 5 seconds. Core Web Vitals are a proxy for that.

The less cynical view: the three metrics Google chose — LCP, CLS, and INP — are genuinely good proxies for user experience. If you optimize for them honestly (not by gaming the metrics), you make your site measurably better for real users.

## LCP: Largest Contentful Paint

**Target: under 2.5 seconds. Good: under 1.2 seconds.**

LCP measures when the largest visible element on the page finishes rendering. On most marketing sites, that's the hero image. On most article pages, it's the headline text. The fix depends on what your LCP element is.

**For image LCP elements:**

The single highest-impact change is preloading the LCP image. Add this to your document `<head>`:

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

Then on the image itself:

```html
<img src="/hero.webp" fetchpriority="high" loading="eager" alt="..." />
```

Never use `loading="lazy"` on your LCP image. The browser won't fetch it until it's in the viewport, which is too late.

Serve images in WebP or AVIF format. AVIF is typically 30-50% smaller than WebP for equivalent quality. Use an `<picture>` element to provide fallbacks for browsers that don't support AVIF.

**For text LCP elements:**

If your LCP is a text element (common for article pages), your bottleneck is almost certainly TTFB (Time to First Byte) or render-blocking resources. Optimize your server response time, eliminate render-blocking stylesheets, and avoid web fonts that block rendering.

If you're using a web font for your headline, use `font-display: optional` (not `swap` — swap still causes layout shift) and preload the font file with `<link rel="preload" as="font">`.

## CLS: Cumulative Layout Shift

**Target: under 0.1. Good: under 0.05.**

CLS measures unexpected layout shifts — elements jumping around as the page loads. The most common causes, in order of frequency I've seen in the wild:

**Images without explicit dimensions.** Always specify `width` and `height` on `<img>` elements. The browser uses these to reserve space before the image loads. Without them, the image loads, expands, and pushes everything down.

```html
<!-- Bad: no dimensions, will cause CLS -->
<img src="hero.webp" alt="..." />

<!-- Good: browser reserves space immediately -->
<img src="hero.webp" width="1200" height="630" alt="..." />
```

**Web fonts swapping in.** When a web font loads and swaps out the fallback font, the text reflows because the two fonts have different metrics. Fix this with `size-adjust`, `ascent-override`, and `descent-override` in your `@font-face` declaration to make the fallback font metrics match your web font.

**Dynamic content injected above existing content.** Cookie banners, notification bars, and sticky headers that appear after page load push content down. Either pre-allocate space for them or position them as overlays (fixed/absolute) so they don't affect document flow.

**Ads and iframes without reserved space.** Always wrap ad slots in a container with explicit minimum dimensions.

## INP: Interaction to Next Paint

**Target: under 200ms. Good: under 100ms.**

INP replaced FID (First Input Delay) as the responsiveness metric in March 2024. Where FID only measured the delay before the browser started processing an interaction, INP measures the full time from interaction to the next visual update. It's a much harder metric to ace.

INP failures are almost always caused by long tasks on the main thread. The browser can't paint a frame while JavaScript is executing. If your click handler kicks off 300ms of synchronous work, your INP is at least 300ms.

**Break up long tasks with `scheduler.yield()`:**

```javascript
async function processLargeDataset(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);

    // Yield to the browser every 50 items
    if (i % 50 === 0) {
      await scheduler.yield();
    }
  }
}
```

`scheduler.yield()` yields control back to the browser, allowing it to handle pending user interactions and paint frames. Chrome 115+ supports it natively; use a polyfill for older browsers.

**Defer non-critical JavaScript:**

```html
<!-- Third-party scripts should be deferred -->
<script src="analytics.js" defer></script>

<!-- Or loaded dynamically after interaction -->
<script>
  document.querySelector('#chat-button').addEventListener('click', async () => {
    const { initChat } = await import('./chat.js');
    initChat();
  });
</script>
```

**Use `content-visibility: auto` for off-screen content:**

```css
.below-the-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
```

This tells the browser to skip rendering off-screen content until it's needed. Reduces the initial render work, which directly improves INP.

## Measurement: Trust Real Data Over Lab Data

Lighthouse scores and PageSpeed Insights give you lab data — synthetic measurements from a controlled environment. They're useful for development, but they can mislead you about real user experience.

For real user data, use the [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals) or implement the `web-vitals` JavaScript library:

```javascript
import { onLCP, onCLS, onINP } from 'web-vitals';

onLCP(metric => sendToAnalytics('lcp', metric.value));
onCLS(metric => sendToAnalytics('cls', metric.value));
onINP(metric => sendToAnalytics('inp', metric.value));
```

Then connect that data to your analytics platform. Real user monitoring (RUM) will show you p75 values — the 75th percentile — which is what Google uses to assess your site in Search Console. A perfect Lighthouse score on a fast laptop doesn't help if your p75 INP on a mid-range Android device is 450ms.

## A Real-World Case Study

An e-commerce client came to me with declining search rankings. Their Google Search Console showed 68% of URLs with "Poor" CWV ratings. Their primary problems were:

- Hero images not preloaded, loading as regular `<img>` with no `fetchpriority`
- Product images lacking `width`/`height` attributes
- A third-party chat widget loading synchronously in `<head>`
- A heavy product recommendation script running on every page load

After four weeks of fixes:
- LCP improved from 4.8s → 1.4s (preloaded hero image, converted to WebP)
- CLS dropped from 0.28 → 0.03 (added image dimensions, pre-allocated space for chat widget)
- INP dropped from 380ms → 95ms (deferred chat widget, lazy-loaded recommendations)

Three months later, their organic search impressions were up 22% and conversion rate improved 8%. Same products, same prices, same copy — just faster.

Core Web Vitals are solvable. The fixes are not glamorous, but they compound. Start with your LCP image, eliminate your layout shifts, and measure your INP with real user data. That sequence alone will move the needle on most sites.

---

*Further reading: [web.dev/vitals](https://web.dev/articles/vitals) · [Google Search Central — Page Experience](https://developers.google.com/search/docs/appearance/page-experience) · [MDN — Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [Chrome User Experience Report](https://developer.chrome.com/docs/crux)*
