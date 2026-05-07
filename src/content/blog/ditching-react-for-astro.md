---
title: "Why I Ditched React for Astro (And Never Looked Back)"
description: "After 6 years of React, I switched to Astro for a client project. Here's what surprised me, what I miss, and why I'll never go back for content-heavy sites."
pubDate: 2025-03-15
updatedDate: 2026-05-06
author: "Elara Voss"
tags: ["Astro", "React", "Performance", "Frontend"]
heroImage: "../../assets/images/hero-ditching-react.jpg"
ogImage: "/og-ditching-react.jpg"
---

Last year I did something that would have felt heretical to me three years ago: I convinced a client to let me rebuild their marketing site in Astro instead of the React + Next.js stack we'd been using for years. The brief was simple — their Core Web Vitals were terrible and organic search was suffering for it. Six months later, their Lighthouse Performance score went from 54 to 100. This is the story of that switch, and why I've now migrated five more projects.

## The Catalyst: A Lighthouse Audit That Hurt to Read

The site in question was a product marketing site for a SaaS company — about 40 pages, a blog, some interactive pricing tables. The React bundle was 380kb gzipped. The Time to First Byte was 1.8 seconds. The Total Blocking Time measured in the hundreds of milliseconds. Google Search Console was showing declining impressions month over month.

I'd patched things before — lazy loading routes, code splitting, deferring analytics — but the fundamental problem was that we were sending a full JavaScript framework to render content that didn't change between visits. The pricing table? That was the only truly interactive element, and it was 12 kilobytes of logic.

## What Astro Actually Does Differently

Astro's core insight is deceptively simple: most websites are mostly static. Ship HTML. Only hydrate the JavaScript that actually needs to be interactive.

The mental model it uses is called [Island Architecture](https://docs.astro.build/en/concepts/islands/). Your page is an ocean of static, server-rendered HTML. The interactive bits — a dropdown menu, a pricing calculator, a comment widget — are islands. Each island is independently hydrated, in isolation, with its own tiny bundle.

Where React's model is "the browser renders everything with JavaScript, starting from an empty div," Astro's model is "the server renders everything as HTML, and a few specific components load JS when they need to."

For a marketing site, the practical outcome is dramatic.

## The Client Directives

The mechanism Astro uses to control hydration is client directives. They look like HTML attributes:

```astro
<!-- Hydrate immediately on page load -->
<PricingTable client:load />

<!-- Hydrate once the browser is idle -->
<ChatWidget client:idle />

<!-- Hydrate once the component scrolls into view -->
<Testimonials client:visible />

<!-- Never hydrate — render server-side only -->
<PricingTable />
```

That last one is the important one. By default, an Astro component ships zero JavaScript. You opt *in* to interactivity. The pricing table example I mentioned? I rewrote it as a vanilla Astro component with no framework dependency, and it became 780 bytes of HTML and CSS.

## What I Miss About React

I want to be honest here. There are things React does better, and pretending otherwise would be doing you a disservice.

**Complex client-side state.** If you're building a dashboard with real-time data, a collaborative editor, or anything with deeply nested state that changes frequently, React's ecosystem (Redux, Zustand, React Query) is still far ahead. Astro will let you use React *inside* an island, but at that point you're still shipping React — you just have more control over when it loads.

**Component ecosystem.** The React component ecosystem is enormous. For anything UI-complex — data tables, rich text editors, date pickers — you'll find a mature, well-maintained React library. Astro is catching up, but it's not there yet.

**Developer familiarity.** Most frontend teams know React. Astro has a learning curve, and the island architecture requires a different mental model. For large teams, that's a real cost.

## Migration Strategy

If you're considering migrating an existing React site to Astro, here's the approach that worked for me:

Start with your most content-heavy pages — blog posts, landing pages, documentation. These are where Astro shines and where the performance wins are largest. Keep your interactive dashboards or app views in React (Astro can coexist with other frameworks through the official integrations).

Audit your components for interactivity. You'll find that the majority of components that *look* interactive are actually just displaying data. Dropdown menus, accordions, tabs — these can often be rebuilt with CSS alone, eliminating their JavaScript entirely.

Finally, measure before you ship. The Lighthouse improvement will be real, but the actual user experience improvement (INP, CLS, LCP) will be your real validation.

## The Results

<figure style="margin: 2rem 0; padding: 1.5rem; background: #161b22; border: 1px solid #30363d; border-radius: 0.75rem;" role="img" aria-label="Bar chart comparing React and Astro bundle sizes and performance metrics">
  <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
    <text x="0" y="16" font-family="monospace" font-size="11" fill="#8b949e">Before (React/Next.js) vs After (Astro)</text>
    <!-- JS Bundle -->
    <text x="0" y="50" font-family="monospace" font-size="10" fill="#8b949e">JS Bundle</text>
    <rect x="90" y="38" width="304" height="14" rx="3" fill="#21262d"/>
    <rect x="90" y="38" width="304" height="14" rx="3" fill="#e85555" opacity="0.7"/>
    <rect x="90" y="38" width="11" height="14" rx="3" fill="#3fb950"/>
    <text x="400" y="50" font-family="monospace" font-size="10" fill="#8b949e">380kb → 14kb</text>
    <!-- LCP -->
    <text x="0" y="90" font-family="monospace" font-size="10" fill="#8b949e">LCP</text>
    <rect x="90" y="78" width="246" height="14" rx="3" fill="#21262d"/>
    <rect x="90" y="78" width="246" height="14" rx="3" fill="#e85555" opacity="0.7"/>
    <rect x="90" y="78" width="72" height="14" rx="3" fill="#3fb950"/>
    <text x="342" y="90" font-family="monospace" font-size="10" fill="#8b949e">4.1s → 1.2s</text>
    <!-- Lighthouse -->
    <text x="0" y="130" font-family="monospace" font-size="10" fill="#8b949e">Lighthouse</text>
    <rect x="90" y="118" width="324" height="14" rx="3" fill="#21262d"/>
    <rect x="90" y="118" width="130" height="14" rx="3" fill="#e85555" opacity="0.7"/>
    <rect x="90" y="118" width="324" height="14" rx="3" fill="#3fb950" opacity="0"/>
    <rect x="90" y="118" width="324" height="14" rx="3" fill="#3fb950"/>
    <text x="420" y="130" font-family="monospace" font-size="10" fill="#8b949e">54 → 100</text>
    <!-- Legend -->
    <rect x="0" y="168" width="10" height="10" rx="2" fill="#e85555" opacity="0.7"/>
    <text x="14" y="177" font-family="monospace" font-size="9" fill="#8b949e">Before</text>
    <rect x="60" y="168" width="10" height="10" rx="2" fill="#3fb950"/>
    <text x="74" y="177" font-family="monospace" font-size="9" fill="#8b949e">After</text>
  </svg>
  <figcaption style="font-size:0.75rem;color:#8b949e;margin-top:0.5rem;font-family:monospace">Performance improvements after migrating from React/Next.js to Astro</figcaption>
</figure>

For the SaaS marketing site: Total JavaScript shipped went from 380kb to 14kb. LCP improved from 4.1s to 1.2s. The Lighthouse Performance score hit 100. Six weeks after launch, organic search impressions were up 34%. These results align closely with what Google's own [Page Experience documentation](https://developers.google.com/search/docs/appearance/page-experience) predicts for sites that move from poor to good Core Web Vitals ratings.

Those numbers are why I've become an Astro advocate. Not because it's new and exciting, but because it genuinely solves a problem that matters: the web is too slow, and most of that slowness comes from unnecessary JavaScript.

For content-heavy sites — marketing pages, portfolios, documentation, blogs — Astro is now my default. I reach for React when I need it, and I need it less often than I used to think.

---

*Further reading: [Astro official documentation](https://docs.astro.build/) · [Understanding Island Architecture](https://docs.astro.build/en/concepts/islands/) · [Why JavaScript Frameworks Matter for Performance](https://web.dev/articles/optimizing-content-efficiency-javascript-startup-optimization) on web.dev*
