# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio in plain HTML, CSS and a little vanilla JS: a home page plus one case-study page per project. There is no build step, package manager, linter or test suite. GitHub Pages serves the repo root of `main`, so whatever is committed to `main` is what goes live.

## Running locally

```bash
python3 -m http.server   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Architecture

- `index.html` is the home page: a hero `<header class="sheet hero">`, then `<main class="sheet content" id="main">` with five sections (`#about`, `#projects`, `#experience`, `#skills`, `#contact`), then a footer.
- `projects/*.html` are the case studies (`ledger-agent`, `syllo`, `dental-time-machine`). They share one layout: a `.case-top` header, then numbered `.sec` sections (problem, ownership, how it works, decisions, the hard part, testing/security, results with limitations and next steps), then a `.case-next` bar linking to the next project in a loop. They load `../css/styles.css` and no JavaScript. To add a project, copy an existing case page, add its card to `#projects`, and update the `.case-next` links so the loop stays closed.
- `css/styles.css` holds all styles for every page. It's organized by banner comments (Colors, Base, Hero, Buttons and links, Menu, Sections, Case study pages, then the media queries). Write rules compactly, one line per rule, to match the file.
- `js/main.js` (home page only) toggles the hamburger menu by flipping the `hidden` attribute on `#site-menu` and on the two button icons, keeps `aria-expanded`/`aria-label` in sync, and closes the menu on Escape. The CSS rule `[hidden]{display:none !important}` makes that work.
- `images/projects/` holds case-study screenshots as WebP. There's no image tooling in the repo; convert PNGs with headless Chrome's canvas `toDataURL('image/webp')` rather than adding a dependency.

### Layout details that span files

- **The desktop hero is absolutely positioned.** `.panel`, `.h-left`, `.h-portrait`, `.h-right`, `.h-foot` and the `.deco` circles are placed with percentage `left`/`top` values inside a fixed-aspect-ratio `.hero` (1.41:1, 700–900px tall). Changing the hero text or the portrait size can make elements overlap, so check it at 1440, 1150 and 1024px.
- **Breakpoints:** at `max-width: 1279px` the top-bar email and the hero's résumé link hide (Résumé stays in the nav) and project cards drop from three columns to two, with the last card spanning both. At `max-width: 1023px` the hero switches to a normal flex column, every hero element is reset to `position:relative`, and the inline `.nav-links` give way to the hamburger menu. At `max-width: 560px` the phone tweaks apply. A new hero element needs overrides in the 1023px block.
- **Section grid:** each `.sec` is a 12-column grid. `.sec-head` takes columns 1–4 (1–7 when followed by `.sec-wide`, via `:has`), `.sec-body` columns 6–12, and `.sec-wide` the full width. At 1023px and below, everything stacks.
- **Colors** are CSS custom properties on `:root` (there is no dark mode). One exception: the chat-icon SVG in the hero hardcodes `#E4E6E9`, which equals `--sheet`, so update both together. Small text on `--panel` should use `--muted`, not `--faint`, to keep 4.5:1 contrast.
- **Section numbering** ("01 — About" … "05 — Contact") appears in each section's `.eyebrow` and again in the `.menu-num` spans of `#site-menu`, and the section links also appear in the top bar's `.nav-links`. When you add, remove or reorder a section, update all three places.
- **The résumé link** (`files/Iyinoluwa-Sopeyin-Resume.pdf`) appears in the nav, the phone menu, the hero, the contact section and every case page's `.case-next` bar. If the file is renamed, update all of them.

## Content rules

- Every claim must trace to evidence: the résumé, the project repos (`~/ledger-agent`, `~/syllo/student-hub`, `~/Hack2/Dental-Time-Machine`) or the user. Don't invent metrics, team sizes, awards, reasons for decisions or links; ask the user.
- Keep the user's work and team work separate. Syllo's case page has a "My work" / "Team work" split built from git authorship. Dental Time Machine shows only the user's own part (results summary, plan comparison, reset reminder); by the user's request, don't describe features they didn't build.
- Label demo data as demo data, and keep planned features under "Next steps", never in results.
- The Pfizer externship stays at résumé-level detail (no case page) unless the user confirms more can be shared publicly.
- Finance Manager is intentionally absent: the user hasn't built it yet.
- Open content questions live in `REVISIT.md`, which is git-ignored and never published.
