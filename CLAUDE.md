# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing website for "Angelsee Heiligenstedten" (a fishing lake), built with Eleventy (11ty). No backend, no database, no login system — content is authored in Markdown/Nunjucks files and central data files, and the site is deployed as static HTML (intended host: Netlify, see `netlify.toml`).

## Commands

- `npm install` — install dependencies (only Eleventy).
- `npm start` — build + serve with live reload at `http://localhost:8080` (`eleventy --serve`).
- `npm run build` — one-off production build into `_site/`.

There is no test suite and no linter configured.

## Architecture

- `.eleventy.js` — Eleventy config. Input dir `src`, output `_site`, passthrough-copies `src/assets` as-is.
- `src/_data/betrieb.js` — single source of truth for business info (name, owner, address, contact, opening hours, lake size, short-info cards). Exposed to all templates as the `betrieb` global data variable. Prefer adding new site-wide facts here over hardcoding them in a page.
- `src/_data/galerie.js` — list of gallery images (file path, alt text, caption) consumed by `src/galerie.njk`.
- `src/_includes/layout.njk` — the only layout; every page sets `layout: layout.njk` in front matter. Contains the `<head>`, header/nav, footer, and renders `{{ content | safe }}` in between.
- Pages live directly under `src/` (one file per route, Eleventy's directory-based routing gives pretty URLs, e.g. `src/preise.md` → `/preise/`).
  - **`.md` pages** (`ueber-uns.md`, `fischbestand.md`, `regeln.md`, `preise.md`) hold free-form prose content meant to be edited by a non-technical site owner. `markdownTemplateEngine` is `njk`, so `{{ betrieb.* }}` interpolation works inside Markdown, but avoid `{% for %}`/`{% if %}` blocks inside `.md` bodies — Nunjucks tags that render to a blank line break CommonMark's HTML-block detection and get wrongly wrapped in `<p>` tags (this happened before; that's why `index.njk`, `galerie.njk`, and `anfahrt-kontakt.njk` are `.njk`, not `.md`).
  - **`.njk` pages** (`index.njk`, `galerie.njk`, `anfahrt-kontakt.njk`) hold structural/dynamic content — anything with loops, conditionals, or a non-trivial layout (card grids, the gallery grid, the contact form + embedded map) — and are rendered as pure Nunjucks with no Markdown pass.
- `src/assets/img/` — currently all placeholder SVGs generated inline (colored rect + label). Real photos should keep the same filenames where possible so no template changes are needed.
- Contact form (`anfahrt-kontakt.njk`) submits via `mailto:` (`action="mailto:..."`, `enctype="text/plain"`) — intentionally not a real backend/form service, per the "no backend" requirement.
- Map embed uses a keyless Google Maps iframe: `https://www.google.com/maps?q=<address>&output=embed`, with the address URL-encoded via Nunjucks' `urlencode` filter.

## Content editing conventions

Placeholder content is marked with `[ECKIGE_KLAMMERN]`. When filling in real content, replace the whole bracketed placeholder text, keep surrounding Markdown/HTML structure intact. See `README.md` for the non-technical editing/publishing guide aimed at the site owner.
