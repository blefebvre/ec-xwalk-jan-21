# WKND Trendsetters Migration Notes

## Project Overview
- **Source:** https://wknd-trendsetters.site/
- **Type:** xwalk (Universal Editor based)
- **Status:** Homepage migrated successfully

## Key Resources
- `migration-work/migration-plan.md` - Full migration status and artifact list
- `migration-work/authoring-analysis.json` - Block decisions with variant names
- `migration-work/cleaned.html` - Source HTML for parser development
- `tools/importer/page-templates.json` - Block selectors for homepage template

## Block Variants Created
| Variant | Base Block | Purpose |
|---------|------------|---------|
| columns-hero | columns | Side-by-side hero images |
| columns-cta | columns | CTA with heading + buttons |
| cards-features | cards | Icon + text feature grid |
| cards-articles | cards | Article cards with image/tag/heading |
| tabs-showcase | tabs | Tabbed content with heading + image |
| accordion-faq | accordion | FAQ Q&A expandable items |

## xwalk Field Hinting Rules
- Add `<!-- field:fieldName -->` comments before content elements
- **Columns blocks are EXEMPT** from field hints (per hinting.md Rule 4)
- Field hints go in parsers, not in the generated content

## Import Workflow
1. Generate parsers in `tools/importer/parsers/`
2. Generate import script: `tools/importer/import-homepage.js`
3. Bundle: `npx aem-import-helper@latest bundle ...`
4. Create URL file: `tools/importer/urls-homepage.txt`
5. Run import: `node bulk-import.js --urls <file> --import-file <bundle>`

## Gotchas
- Import script expects a **file path** to URLs, not a URL string directly
- Playwright must be installed in the bulk-import scripts directory
- Parser validation hook runs on every Edit - check output matches source content
- Section-metadata blocks handle section styling (grey, dark) - use `section: "style"` in page-templates.json

## Content Output
- `content/index.plain.html` - Migrated homepage
- Preview at: http://localhost:3000/content/index
