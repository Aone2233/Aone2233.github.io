# Markdown Code Style (GitHub Light) Design

Date: 2026-03-20
Owner: aone2233
Scope: Jekyll site (all Markdown-rendered areas)

## Goal
Unify all Markdown-rendered code styling (inline code and code blocks) to match GitHub light theme defaults across the entire site. This removes the current dark code overrides that render inline code as black background with red text.

## Non-Goals
- Changing overall site theme or layout.
- Altering non-Markdown UI components (navigation, cards, etc.).
- Reworking syntax highlighter configuration beyond CSS overrides.

## Current State Summary
- Markdown content uses `.markdown-body` and is rendered in posts, wiki, fragments, and other content pages.
- Dark code overrides are enforced by `assets/css/components/code-improvement.css` and `assets/css/components/code-override.css`, both loaded after the Rouge theme CSS in `_includes/header.html`.
- The site uses `highlight_theme: github` in `_config.yml`, but dark overrides currently supersede it.

## Options Considered
1. **Add a GitHub-light override stylesheet (recommended)**
   - Introduce a new CSS file loaded last that resets code colors to GitHub light for `.markdown-body`.
   - Low risk, minimal change, easily reversible.

2. **Remove dark code CSS includes**
   - Delete references to `code-improvement.css` and `code-override.css`.
   - Cleanest but may remove other desired code tweaks.

3. **Scope dark code styles to specific pages**
   - Add page-level classes and limit dark overrides to those pages.
   - More complex; not needed for this goal.

## Chosen Approach
Proceed with Option 1: add a small, focused override CSS file that restores GitHub light code styling for all `.markdown-body` regions, and load it after the existing code CSS files. This preserves existing code-related tweaks while ensuring Markdown code appearance matches GitHub light.

## Design Details
### CSS Scope
- Target `.markdown-body` to affect Markdown-rendered content only.
- Cover both inline code and code blocks:
  - Inline: `code`, `tt` when not inside `pre`.
  - Blocks: `pre`, `.highlight`, and nested `code`.

### Expected Visuals
- Inline code: light gray background, dark text, subtle border (GitHub default feel).
- Code blocks: light background, dark text, subtle border.
- Syntax colors should follow Rouge `github` theme.

### Files & Loading Order
- New file: `assets/css/components/code-github-light.css`.
- Load after `code-override.css` in `_includes/header.html`.

### Risks & Mitigations
- **Risk:** Some code tokens still appear dark due to `!important` in old CSS.
  - **Mitigation:** Use `.markdown-body`-scoped selectors with equal or higher specificity, and apply `!important` only where necessary.

## Testing Plan
- Open a recent post with inline code and code blocks.
- Verify inline code background and text are light theme.
- Verify code blocks use light background and readable token colors.
- Spot-check wiki and fragment pages for consistent appearance.

## Rollback
- Remove `code-github-light.css` include from `_includes/header.html`.
- Delete the new CSS file if desired.
