# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page personal portfolio in plain HTML, CSS and a little vanilla JS. There is no build step, package manager, linter or test suite. GitHub Pages serves `index.html` from the root of `main`, so whatever is committed to `main` is what goes live.

## Running locally

```bash
python3 -m http.server   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Architecture

- `index.html` holds all content. It has a hero `<header class="sheet hero">`, then a `<main class="sheet content">` with five sections (`#about`, `#projects`, `#experience`, `#skills`, `#contact`), then a footer.
- `css/styles.css` holds all styles. It's organized by banner comments (Colors, Base, Hero, Buttons and links, Menu, Sections, then the media queries). Write rules compactly, one line per rule, to match the file.
- `js/main.js` does one thing: it toggles the hamburger menu by flipping the `hidden` attribute on `#site-menu` and on the two button icons, and keeps `aria-expanded`/`aria-label` in sync. The CSS rule `[hidden]{display:none !important}` makes that work.

### Layout details that span files

- **The desktop hero is absolutely positioned.** `.panel`, `.h-left`, `.h-portrait`, `.h-right`, `.h-foot` and the `.deco` circles are placed with percentage `left`/`top` values inside a fixed-aspect-ratio `.hero` (1.41:1, 700–900px tall). Changing the hero text or the portrait size can make elements overlap, so check it at several widths.
- **Breakpoints:** at `max-width: 1279px` the top-bar email hides and the project cards drop from three columns to two, with the last card spanning both. At `max-width: 1023px` the hero switches to a normal flex column, every hero element is reset to `position:relative`, and the inline `.nav-links` give way to the hamburger menu. At `max-width: 560px` the phone tweaks apply. A new hero element needs overrides in the 1023px block.
- **Section grid:** each `.sec` is a 12-column grid. `.sec-head` takes columns 1–4, `.sec-body` columns 6–12, and `.sec-wide` spans the full width. At 1023px and below, everything stacks.
- **Colors** are CSS custom properties on `:root` (there is no dark mode). One exception: the chat-icon SVG in the hero hardcodes `#E4E6E9`, which equals `--sheet`, so update both together.
- **Section numbering** ("01 — About" … "05 — Contact") appears in each section's `.eyebrow` and again in the `.menu-num` spans of `#site-menu`, and the section links also appear in the top bar's `.nav-links`. When you add, remove or reorder a section, update all three places.

## Content source

Project, experience and skills content is drawn from the user's résumé (`files/Iyinoluwa-Sopeyin-Resume.pdf`). Don't invent links or claims; ask the user. Syllo has no public repo yet, so its card has no links.
