# AGENTS.md

Docs site for the Tallinn Design System (https://disain.tallinn.ee/), built with Docusaurus 3.
Upstream repo: https://github.com/Tallinnlv/disain

## Commands

Yarn is not installed globally — use corepack (Node >= 18 required):

- `corepack yarn` — install dependencies
- `corepack yarn start` — dev server on http://localhost:3000
- `corepack yarn build` — production build (also validates all MDX across all versions)
- `corepack yarn serve` — serve the production build
- `corepack yarn styles` — SASS watcher: compiles `src/css/tds-library/scss` → `src/css/tds-library/css/tds-next.min.css`; run this in a second terminal when editing design-system SCSS
- `corepack yarn stylelint` — lint SCSS/CSS
- `yarn lint` is **broken as shipped**: it references an `.eslintrc.js` that was never committed. Don't try to fix lint errors via this script.

## Architecture

- **Content** is MDX in `docs/`, split into `getting-started/`, `foundations/`, `components/`, `patterns/`. Nav sidebars are in `sidebars.js`, config in `docusaurus.config.js`.
- **Component pages** are stitched from partials — each component dir has `_overview.mdx`, `_usage.mdx`, `_a11y.mdx` rendered as tabs by the custom `OverviewTemplate` (`src/components/`). Many `_a11y.mdx` files are still lorem ipsum placeholders.
- **Versioning**: `versioned_docs/` holds full snapshots of 1.0.0 and 2.0.0; `docs/` is the work-in-progress "Canary 🚧". **2.0.0 is the default version visitors see**, so doc edits usually need to be applied to `docs/` AND the affected `versioned_docs/version-*/` copies. HTML templates and CSS are NOT covered by `docusaurus docs:version` — they must be versioned manually.
- **The design system's own CSS ships in this repo**: `src/css/tds-library/scss/` (ITCSS-style: settings/tools/base/components/vendor), compiled by `yarn styles`. The output CSS is exposed as a static dir (`staticDirectories` in docusaurus.config.js) and watched by the custom `plugins/tds-watcher-plugin`, which triggers a rebuild when it changes.
- **Live examples** render in iframes via the `CodePreview*` components (`src/components/`). They load component JS from `static/scripts/` — these scripts are **shared by all doc versions** (e.g. `static/scripts/components/feedback-tooltip.js`), so one behavior fix there applies everywhere; there is no per-version copy.
- **Swizzled theme**: `src/theme/` overrides Navbar, Footer, DocItem, Layout, etc.
- **Validation console**: the floating "Design System Validation" panel on component pages is homegrown (`src/utils/designSystemValidator.js`, `_a11yScanner.js`, `validationConsole.js`). It overlays the page and can block clicks when testing examples.

## Git workflow

GitHub Flow. `main` is always deployable and is never committed to or pushed directly — treat local `main` as read-only (pull only).

- **Branches**: one short-lived branch per task off an up-to-date `main`, named `type/short-description` (e.g. `fix/tooltip-esc-dismiss`, `docs/button-a11y-content`). Delete after merge.
- **Post-merge cleanup (Codex does this every time)**: GitHub's "Automatically delete head branches" cannot be enabled (vvogt has write but not admin on Tallinnlv/disain; an org owner would have to flip it). So after the user reports a PR merged, always: `git checkout main && git pull`, `git branch -d <branch>`, and `git push origin --delete <branch>`.
- **Commits**: one logical change per commit; never mix a fix with housekeeping in the same commit. Conventional Commits prefixes: `fix:`, `feat:`, `docs:`, `chore:`. Subject says why, not just what (`fix: close tooltip on Esc key (WCAG 1.4.13)`, not `fix tooltip`); the body carries anything the diff can't say (why this approach, what's invisible in the diff, e.g. "this script is shared by all doc versions").
- **Authorship**: commits are authored by the user only. Do NOT add a `Co-Authored-By: Codex` trailer or any other Codex attribution in commits, PR descriptions, or anywhere else in the repo (explicit owner preference).
- **Pull requests**: every branch lands via PR, even solo work. Description shape: Problem (the why, for someone without context) → Fix/approach with notes for review (pre-answer what a reviewer would challenge) → How to test (concrete steps). Squash-merge is the default; use "Rebase and merge" only when a PR intentionally carries multiple distinct commits.
- **Pushing**: Codex commits locally but does not push or open PRs without being asked; the user usually publishes branches and merges via GitHub Desktop.
- **yarn.lock**: `corepack yarn install` regenerates it with large diffs. Don't commit lockfile churn unless dependencies were intentionally changed (`git checkout -- yarn.lock` to discard).

## Gotchas

- **Never run `yarn build` while the dev server is running.** Both write to the shared `.docusaurus/` generated folder; the build regenerates it in production mode (registering the gtag client module), the dev server hot-reloads that, and every route change then throws a `window.gtag is not a function` overlay — the dev HTML never injects the gtag script the module expects. The cookie banner is unrelated (it only sets a cookie). Fix: restart the dev server so it regenerates `.docusaurus/` in development mode. To build while the dev server runs, stop it first (or accept restarting it after).
- `onBrokenLinks: 'warn'` — the build succeeds despite some known broken links (e.g. `/docs/null/components/changelog/` from the forms patterns pages). Don't treat those warnings as new regressions.
- The repo history is a single "project init" commit; git blame/log won't explain anything.
